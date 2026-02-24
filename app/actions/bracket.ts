'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============================================================
// HELPERS
// ============================================================

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ============================================================
// GENERATE BRACKET  (Top-down, Single Elimination)
// ============================================================

/**
 * Generates a full single-elimination bracket for a tournament.
 *
 * Algorithm:
 *  1. Fetch approved participants, validate power-of-2 count.
 *  2. Build match tree top-down (Final first → recurse to Semi → Quarter…).
 *  3. At leaf level (round 1), assign shuffled players.
 *  4. Wrap everything in a Prisma $transaction.
 */
export async function generateBracket(tournamentId: string) {
  // 1. Check if bracket already exists
  const existingMatches = await prisma.match.count({
    where: { tournamentId },
  })
  if (existingMatches > 0) {
    throw new Error('Bracket đã được tạo cho giải đấu này rồi. Vui lòng xóa bracket cũ trước khi tạo mới.')
  }

  // 2. Fetch approved registrations
  const registrations = await prisma.registration.findMany({
    where: { tournamentId, status: 'approved' },
    include: { profile: { select: { userId: true, fullName: true } } },
  })

  const playerCount = registrations.length

  // 3. Validate power of 2
  if (playerCount < 2) {
    throw new Error('Cần ít nhất 2 người chơi đã duyệt để tạo bracket.')
  }
  if (!isPowerOfTwo(playerCount)) {
    throw new Error(
      `Số lượng người chơi phải là lũy thừa của 2 (4, 8, 16, 32). Hiện tại có ${playerCount} người.`
    )
  }

  // 4. Shuffle players
  const players = shuffle(registrations.map((r) => r.profile.userId))

  // 5. Calculate total rounds:  log2(playerCount)
  const totalRounds = Math.log2(playerCount)

  // 6. Build match tree top-down
  //    We first create all match "descriptors" in memory, then batch-insert.
  interface MatchDescriptor {
    tempId: string           // temporary ID for linking before DB insert
    round: number
    matchIndex: number
    player1Id: string | null
    player2Id: string | null
    nextTempId: string | null
    nextMatchSlot: string | null
  }

  const descriptors: MatchDescriptor[] = []
  let tempIdCounter = 0

  function buildTree(round: number, matchIndex: number, parentTempId: string | null, slot: string | null): string {
    const tempId = `temp_${tempIdCounter++}`

    if (round === 1) {
      // Leaf node – assign actual players
      const pairIndex = matchIndex * 2
      descriptors.push({
        tempId,
        round,
        matchIndex,
        player1Id: players[pairIndex] ?? null,
        player2Id: players[pairIndex + 1] ?? null,
        nextTempId: parentTempId,
        nextMatchSlot: slot,
      })
    } else {
      // Internal node – no players yet, they come from child winners
      descriptors.push({
        tempId,
        round,
        matchIndex,
        player1Id: null,
        player2Id: null,
        nextTempId: parentTempId,
        nextMatchSlot: slot,
      })

      // Create two children
      const childRound = round - 1
      buildTree(childRound, matchIndex * 2, tempId, 'P1')
      buildTree(childRound, matchIndex * 2 + 1, tempId, 'P2')
    }

    return tempId
  }

  // Start from Final (highest round, index 0, no parent)
  buildTree(totalRounds, 0, null, null)

  // 7. Insert into DB using $transaction
  //    We need to insert in order: higher rounds first (Final → Semi → …)
  //    so that nextMatchId references exist.  OR insert all without nextMatchId
  //    first, then update.  The latter approach is simpler with $transaction.

  // Step A: Create all matches (without nextMatchId)
  const tempIdToDbId: Record<string, string> = {}

  await prisma.$transaction(async (tx) => {
    // Sort: highest round first so parents are created before children reference them
    const sorted = [...descriptors].sort((a, b) => b.round - a.round)

    for (const d of sorted) {
      const match = await tx.match.create({
        data: {
          tournamentId,
          round: d.round,
          matchIndex: d.matchIndex,
          player1Id: d.player1Id,
          player2Id: d.player2Id,
          status: d.round === 1 ? 'SCHEDULED' : 'PENDING',
        },
      })
      tempIdToDbId[d.tempId] = match.id
    }

    // Step B: Update nextMatchId & nextMatchSlot for all matches that have a parent
    for (const d of sorted) {
      if (d.nextTempId) {
        await tx.match.update({
          where: { id: tempIdToDbId[d.tempId] },
          data: {
            nextMatchId: tempIdToDbId[d.nextTempId],
            nextMatchSlot: d.nextMatchSlot,
          },
        })
      }
    }
  })

  // 8. Update tournament status
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: 'CONFIRMED' },
  })

  revalidatePath(`/tournaments/${tournamentId}`)
  return { success: true, message: `Đã tạo bracket cho ${playerCount} người chơi (${totalRounds} vòng).` }
}


// ============================================================
// ADVANCE WINNER
// ============================================================

/**
 * Records the result of a match and advances the winner to the next round.
 */
export async function advanceWinner(matchId: string, winnerId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  })

  if (!match) throw new Error('Trận đấu không tồn tại.')
  if (match.status === 'COMPLETED') throw new Error('Trận đấu đã kết thúc.')
  if (match.player1Id !== winnerId && match.player2Id !== winnerId) {
    throw new Error('Winner ID không phải là người chơi trong trận đấu này.')
  }

  await prisma.$transaction(async (tx) => {
    // 1. Update current match
    await tx.match.update({
      where: { id: matchId },
      data: {
        winnerId,
        status: 'COMPLETED',
        isLive: false,
      },
    })

    // 2. Advance winner to next match
    if (match.nextMatchId && match.nextMatchSlot) {
      const updateData: Record<string, string> = {}

      if (match.nextMatchSlot === 'P1') {
        updateData.player1Id = winnerId
      } else if (match.nextMatchSlot === 'P2') {
        updateData.player2Id = winnerId
      }

      await tx.match.update({
        where: { id: match.nextMatchId },
        data: {
          ...updateData,
          status: 'SCHEDULED', // Next match becomes schedulable
        },
      })
    }
  })

  revalidatePath(`/tournaments/${match.tournamentId}`)
  return { success: true }
}

// ============================================================
// UPDATE MATCH SCORE
// ============================================================

export async function updateMatchScore(
  matchId: string,
  scoreP1: number,
  scoreP2: number
) {
  const match = await prisma.match.findUnique({ where: { id: matchId } })
  if (!match) throw new Error('Trận đấu không tồn tại.')

  await prisma.match.update({
    where: { id: matchId },
    data: {
      scoreP1,
      scoreP2,
      status: 'IN_PROGRESS',
      isLive: true,
    },
  })

  revalidatePath(`/tournaments/${match.tournamentId}`)
  return { success: true }
}

// ============================================================
// DELETE BRACKET (Reset)
// ============================================================

export async function deleteBracket(tournamentId: string) {
  await prisma.match.deleteMany({
    where: { tournamentId },
  })

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: 'PENDING_CONFIRMATION' },
  })

  revalidatePath(`/tournaments/${tournamentId}`)
  return { success: true }
}

// ============================================================
// GET BRACKET DATA
// ============================================================

export async function getBracketData(tournamentId: string) {
  const matches = await prisma.match.findMany({
    where: { tournamentId },
    orderBy: [{ round: 'asc' }, { matchIndex: 'asc' }],
  })

  // Group by round
  const rounds: Record<number, typeof matches> = {}
  for (const m of matches) {
    if (!rounds[m.round]) rounds[m.round] = []
    rounds[m.round].push(m)
  }

  return { matches, rounds }
}

// ============================================================
// GET PLAYER NAMES (for display)
// ============================================================

export async function getPlayerNames(playerIds: string[]) {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: playerIds } },
    select: { userId: true, fullName: true },
  })

  const nameMap: Record<string, string> = {}
  for (const p of profiles) {
    nameMap[p.userId] = p.fullName || 'Ẩn danh'
  }
  return nameMap
}

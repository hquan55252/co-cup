'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Generates the initial bracket for a tournament.
 * @param tournamentId The ID of the tournament.
 */
export async function generateBracket(tournamentId: string, _formData?: FormData) {
  const supabase = await createClient()

  // 1. Fetch approved registrations
  const { data: registrations, error: fetchError } = await supabase
    .from('registrations')
    .select('user_id')
    .eq('tournament_id', tournamentId)
    .eq('status', 'approved')

  if (fetchError) {
    console.error('Error fetching registrations:', fetchError)
    throw new Error('Failed to fetch registrations')
  }

  if (!registrations || registrations.length < 2) {
    throw new Error('Not enough approved registrations to generate a bracket')
  }

  // 2. Shuffle participants
  const shuffled = [...registrations].sort(() => Math.random() - 0.5)

  // 3. Create Round 1 matches
  const matches = []
  const round = 1

  // Pair up players
  for (let i = 0; i < shuffled.length; i += 2) {
    const player1 = shuffled[i]
    const player2 = shuffled[i + 1] // Can be undefined if odd number

    matches.push({
      tournament_id: tournamentId,
      round: round,
      player1_id: player1.user_id,
      player2_id: player2 ? player2.user_id : null, // Bye if no opponent
      score_p1: 0,
      score_p2: 0,
      is_live: false,
    })
  }

  // 4. Insert matches into DB
  const { error: insertError } = await supabase
    .from('matches')
    .insert(matches)

  if (insertError) {
    console.error('Error inserting matches:', insertError)
    throw new Error('Failed to generate bracket matches')
  }

  // 5. Update tournament status to 'ongoing' (optional but good practice)
  await supabase
    .from('tournaments')
    .update({ status: 'ongoing' })
    .eq('id', tournamentId)

  revalidatePath(`/tournaments/${tournamentId}`)

}

export async function updateScore(matchId: string, player: 'p1' | 'p2', increment: number) {
  const supabase = await createClient()

  // 1. Get current score
  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select(`score_${player}`)
    .eq('id', matchId)
    .single()

  if (fetchError || !match) {
    throw new Error('Match not found')
  }

  const currentScore = match[`score_${player}` as keyof typeof match] as number
  const newScore = Math.max(0, currentScore + increment)

  // 2. Update score
  const { error: updateError } = await supabase
    .from('matches')
    .update({ [`score_${player}`]: newScore })
    .eq('id', matchId)

  if (updateError) {
    throw new Error('Failed to update score')
  }

  revalidatePath(`/matches/${matchId}`)
  return { success: true, newScore }
}

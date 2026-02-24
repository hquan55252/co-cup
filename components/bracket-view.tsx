import { getBracketData, getPlayerNames } from '@/app/actions/bracket'
import { BracketViewClient } from '@/components/bracket/bracket-view-client'

interface BracketViewProps {
  tournamentId: string
  isOrganizer: boolean
  tournamentName?: string
}

export default async function BracketView({ tournamentId, isOrganizer, tournamentName }: BracketViewProps) {
  const { matches } = await getBracketData(tournamentId)

  // Collect all player IDs to fetch names
  const playerIdSet = new Set<string>()
  for (const m of matches) {
    if (m.player1Id) playerIdSet.add(m.player1Id)
    if (m.player2Id) playerIdSet.add(m.player2Id)
    if (m.winnerId) playerIdSet.add(m.winnerId)
  }

  const playerNames = playerIdSet.size > 0
    ? await getPlayerNames(Array.from(playerIdSet))
    : {}

  return (
    <BracketViewClient
      matches={matches}
      playerNames={playerNames}
      isOrganizer={isOrganizer}
      tournamentName={tournamentName}
    />
  )
}

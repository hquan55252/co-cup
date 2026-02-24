'use client'

import * as React from 'react'
import { MatchCard } from './match-card'
import { MatchUpdateDialog } from './match-update-dialog'
import { Trophy } from 'lucide-react'

interface Match {
  id: string
  round: number
  matchIndex: number
  player1Id: string | null
  player2Id: string | null
  scoreP1: number
  scoreP2: number
  winnerId: string | null
  status: string
  isLive: boolean
  nextMatchId: string | null
  nextMatchSlot: string | null
}

interface BracketViewClientProps {
  matches: Match[]
  playerNames: Record<string, string>
  isOrganizer: boolean
  tournamentName?: string
}

export function BracketViewClient({ matches, playerNames, isOrganizer, tournamentName }: BracketViewClientProps) {
  const [selectedMatchId, setSelectedMatchId] = React.useState<string | null>(null)

  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-4">
        <div className="p-6 rounded-full bg-slate-900/50 ring-1 ring-white/5">
          <Trophy className="h-12 w-12 opacity-30 text-yellow-500" />
        </div>
        <p className="text-lg font-medium text-slate-400">Chưa có lịch thi đấu</p>
        <p className="text-sm text-slate-600">Hãy duyệt người chơi và tạo bracket để bắt đầu.</p>
      </div>
    )
  }

  // Group matches by round
  const rounds: Record<number, Match[]> = {}
  for (const m of matches) {
    if (!rounds[m.round]) rounds[m.round] = []
    rounds[m.round].push(m)
  }

  // Sort each round by matchIndex
  for (const round of Object.keys(rounds)) {
    rounds[Number(round)].sort((a, b) => a.matchIndex - b.matchIndex)
  }

  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b)
  const totalRounds = Math.max(...roundNumbers)

  const selectedMatch = selectedMatchId
    ? matches.find((m) => m.id === selectedMatchId) ?? null
    : null

  function getRoundLabel(round: number): string {
    if (round === totalRounds) return 'Chung Kết'
    if (round === totalRounds - 1) return 'Bán Kết'
    if (round === totalRounds - 2) return 'Tứ Kết'
    return `Vòng ${round}`
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-row gap-0 items-stretch min-w-max py-4 px-2">
          {roundNumbers.map((round, roundIdx) => {
            const matchesInRound = rounds[round]
            const isLastRound = round === totalRounds
            
            return (
              <React.Fragment key={round}>
                {/* Round Column */}
                <div className="flex flex-col items-center">
                  {/* Round Header */}
                  <div className="mb-4 text-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-500/80">
                      {getRoundLabel(round)}
                    </h3>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {matchesInRound.length} trận
                    </p>
                  </div>

                  {/* Matches */}
                  <div className="flex flex-col justify-around flex-1 gap-4">
                    {matchesInRound.map((match) => (
                      <div key={match.id} className="flex items-center">
                        <MatchCard
                          match={match}
                          playerNames={playerNames}
                          isOrganizer={isOrganizer}
                          onEdit={setSelectedMatchId}
                          totalRounds={totalRounds}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connector Column (between rounds) */}
                {!isLastRound && (
                  <div className="flex flex-col justify-around flex-1 w-12 mx-1">
                    {matchesInRound.map((_, idx) => {
                      // Every pair of matches connects to one match in next round
                      if (idx % 2 === 1) return null
                      return (
                        <div key={idx} className="flex flex-col items-center relative" style={{ flex: 1 }}>
                          {/* Top line */}
                          <div className="absolute top-1/4 right-0 left-0 border-t border-slate-700/60 h-0" />
                          {/* Bottom line */}
                          <div className="absolute bottom-1/4 right-0 left-0 border-t border-slate-700/60 h-0" />
                          {/* Vertical line connecting top and bottom */}
                          <div className="absolute top-1/4 bottom-1/4 right-0 border-r border-slate-700/60 w-0" />
                          {/* Horizontal line going to next match */}
                          <div className="absolute top-1/2 right-0 w-1/2 border-t border-slate-700/60 h-0" style={{ transform: 'translateY(-50%)' }} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Match Update Dialog */}
      {isOrganizer && (
        <MatchUpdateDialog
          open={!!selectedMatchId}
          onOpenChange={(open) => !open && setSelectedMatchId(null)}
          match={selectedMatch}
          playerNames={playerNames}
          totalRounds={totalRounds}
        />
      )}
    </>
  )
}

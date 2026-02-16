import { createClient } from '@/utils/supabase/server'

interface Match {
  id: string
  round: number
  player1_id: string | null
  player2_id: string | null
  score_p1: number
  score_p2: number
  // Ideally, we'd join with profiles to get names, but keeping it simple or assuming IDs for now.
  // In a real app, I'd fetch profiles or use a join.
}

async function getMatches(tournamentId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('round', { ascending: true })
    .order('created_at', { ascending: true }) // Stable order within round
  
  return data as Match[]
}

export default async function BracketView({ tournamentId }: { tournamentId: string }) {
  const matches = await getMatches(tournamentId)

  if (!matches || matches.length === 0) {
    return <div className="text-center p-4">Chưa có lịch thi đấu.</div>
  }

  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    const round = match.round
    if (!acc[round]) {
      acc[round] = []
    }
    acc[round].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b)

  return (
    <div className="flex flex-row gap-8 overflow-x-auto p-4 items-center">
      {roundNumbers.map((round) => (
        <div key={round} className="flex flex-col gap-4 min-w-[200px]">
          <h3 className="text-lg font-bold text-center mb-2">Vòng {round}</h3>
          {rounds[round].map((match) => (
            <div key={match.id} className="relative border rounded p-2 bg-white dark:bg-gray-800 shadow text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className={!match.player1_id ? "text-gray-400" : ""}>{match.player1_id ? match.player1_id.slice(0, 8) : 'Trống'}</span>
                <span className="font-bold">{match.score_p1}</span>
              </div>
              <div className="border-t my-1"></div>
              <div className="flex justify-between items-center">
                <span className={!match.player2_id ? "text-gray-400" : ""}>{match.player2_id ? match.player2_id.slice(0, 8) : 'Trống'}</span>
                <span className="font-bold">{match.score_p2}</span>
              </div>
              
              {/* Connector Line Logic (Pure CSS/Visual) */}
               {round < Math.max(...roundNumbers) && (
                 <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-gray-300"></div>
               )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

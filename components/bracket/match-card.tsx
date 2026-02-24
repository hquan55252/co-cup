'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MatchCardProps {
  match: {
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
  }
  playerNames: Record<string, string>
  isOrganizer?: boolean
  onEdit?: (matchId: string) => void
  totalRounds: number
}

function getRoundLabel(round: number, totalRounds: number): string {
  if (round === totalRounds) return 'Chung Kết'
  if (round === totalRounds - 1) return 'Bán Kết'
  if (round === totalRounds - 2) return 'Tứ Kết'
  return `Vòng ${round}`
}

function getStatusBadge(status: string, isLive: boolean) {
  if (isLive) return { label: 'LIVE', className: 'bg-red-500 text-white animate-pulse' }
  switch (status) {
    case 'COMPLETED': return { label: 'Kết thúc', className: 'bg-green-500/20 text-green-400 border-green-500/30' }
    case 'SCHEDULED': return { label: 'Sắp diễn ra', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    case 'IN_PROGRESS': return { label: 'Đang đấu', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
    default: return { label: 'Chờ', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
  }
}

export function MatchCard({ match, playerNames, isOrganizer, onEdit, totalRounds }: MatchCardProps) {
  const p1Name = match.player1Id ? (playerNames[match.player1Id] || 'Ẩn danh') : 'Chưa xác định'
  const p2Name = match.player2Id ? (playerNames[match.player2Id] || 'Ẩn danh') : 'Chưa xác định'
  const statusBadge = getStatusBadge(match.status, match.isLive)
  const isCompleted = match.status === 'COMPLETED'

  return (
    <div
      className={cn(
        "w-[220px] rounded-lg border bg-slate-900 overflow-hidden transition-all shadow-sm",
        isCompleted ? "border-slate-700/50" : "border-slate-800",
        match.isLive && "border-red-500/50 shadow-red-500/10 shadow-lg",
        isOrganizer && match.status !== 'PENDING' && "cursor-pointer hover:border-yellow-500/50",
      )}
      onClick={() => isOrganizer && match.status !== 'PENDING' && onEdit?.(match.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 border-b border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Trận {match.matchIndex + 1}
        </span>
        <Badge className={cn("text-[9px] px-1.5 py-0 h-4 border", statusBadge.className)}>
          {statusBadge.label}
        </Badge>
      </div>

      {/* Players */}
      <div className="divide-y divide-slate-800/50">
        {/* Player 1 */}
        <div className={cn(
          "flex items-center justify-between px-3 py-2.5 transition-colors",
          isCompleted && match.winnerId === match.player1Id && "bg-green-500/5",
        )}>
          <div className="flex items-center gap-2 min-w-0">
            {isCompleted && match.winnerId === match.player1Id && (
              <span className="text-green-400 text-xs">▶</span>
            )}
            <span className={cn(
              "text-sm truncate",
              !match.player1Id ? "text-slate-600 italic" : "text-slate-200",
              isCompleted && match.winnerId === match.player1Id && "text-green-400 font-semibold",
            )}>
              {p1Name}
            </span>
          </div>
          <span className={cn(
            "text-sm font-bold tabular-nums ml-2",
            isCompleted && match.winnerId === match.player1Id ? "text-green-400" : "text-slate-400"
          )}>
            {match.scoreP1}
          </span>
        </div>

        {/* Player 2 */}
        <div className={cn(
          "flex items-center justify-between px-3 py-2.5 transition-colors",
          isCompleted && match.winnerId === match.player2Id && "bg-green-500/5",
        )}>
          <div className="flex items-center gap-2 min-w-0">
            {isCompleted && match.winnerId === match.player2Id && (
              <span className="text-green-400 text-xs">▶</span>
            )}
            <span className={cn(
              "text-sm truncate",
              !match.player2Id ? "text-slate-600 italic" : "text-slate-200",
              isCompleted && match.winnerId === match.player2Id && "text-green-400 font-semibold",
            )}>
              {p2Name}
            </span>
          </div>
          <span className={cn(
            "text-sm font-bold tabular-nums ml-2",
            isCompleted && match.winnerId === match.player2Id ? "text-green-400" : "text-slate-400"
          )}>
            {match.scoreP2}
          </span>
        </div>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { advanceWinner, updateMatchScore } from '@/app/actions/bracket'
import { Loader2, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MatchUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  } | null
  playerNames: Record<string, string>
  totalRounds: number
}

export function MatchUpdateDialog({ open, onOpenChange, match, playerNames, totalRounds }: MatchUpdateDialogProps) {
  const [scoreP1, setScoreP1] = React.useState(0)
  const [scoreP2, setScoreP2] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (match) {
      setScoreP1(match.scoreP1)
      setScoreP2(match.scoreP2)
      setError('')
    }
  }, [match])

  if (!match) return null

  const p1Name = match.player1Id ? (playerNames[match.player1Id] || 'Ẩn danh') : 'Chưa xác định'
  const p2Name = match.player2Id ? (playerNames[match.player2Id] || 'Ẩn danh') : 'Chưa xác định'
  const isCompleted = match.status === 'COMPLETED'
  const canUpdate = match.player1Id && match.player2Id && !isCompleted

  async function handleSaveScore() {
    if (!match) return
    setLoading(true)
    setError('')
    try {
      await updateMatchScore(match.id, scoreP1, scoreP2)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeclareWinner(winnerId: string) {
    if (!match) return
    setLoading(true)
    setError('')
    try {
      // Save scores first, then advance
      await updateMatchScore(match.id, scoreP1, scoreP2)
      await advanceWinner(match.id, winnerId)
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function getRoundLabel(round: number): string {
    if (round === totalRounds) return 'Chung Kết'
    if (round === totalRounds - 1) return 'Bán Kết'
    if (round === totalRounds - 2) return 'Tứ Kết'
    return `Vòng ${round}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-white">
        <DialogTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {getRoundLabel(match.round)} — Trận {match.matchIndex + 1}
        </DialogTitle>

        {isCompleted && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-fit">
            Đã kết thúc
          </Badge>
        )}

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Score Board */}
        <div className="space-y-4 mt-2">
          {/* Player 1 */}
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-colors",
            isCompleted && match.winnerId === match.player1Id
              ? "border-green-500/30 bg-green-500/5"
              : "border-slate-800 bg-slate-900/50"
          )}>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-semibold truncate",
                isCompleted && match.winnerId === match.player1Id ? "text-green-400" : "text-slate-200"
              )}>
                {p1Name}
              </p>
              {isCompleted && match.winnerId === match.player1Id && (
                <span className="text-xs text-green-500">🏆 Thắng</span>
              )}
            </div>
            <Input
              type="number"
              min={0}
              value={scoreP1}
              onChange={(e) => setScoreP1(Number(e.target.value))}
              disabled={isCompleted || !canUpdate}
              className="w-20 text-center text-lg font-bold bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="text-center text-slate-600 text-sm font-bold">VS</div>

          {/* Player 2 */}
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-colors",
            isCompleted && match.winnerId === match.player2Id
              ? "border-green-500/30 bg-green-500/5"
              : "border-slate-800 bg-slate-900/50"
          )}>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-semibold truncate",
                isCompleted && match.winnerId === match.player2Id ? "text-green-400" : "text-slate-200"
              )}>
                {p2Name}
              </p>
              {isCompleted && match.winnerId === match.player2Id && (
                <span className="text-xs text-green-500">🏆 Thắng</span>
              )}
            </div>
            <Input
              type="number"
              min={0}
              value={scoreP2}
              onChange={(e) => setScoreP2(Number(e.target.value))}
              disabled={isCompleted || !canUpdate}
              className="w-20 text-center text-lg font-bold bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Actions */}
        {canUpdate && (
          <div className="space-y-3 mt-4">
            <Button
              onClick={handleSaveScore}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu Tỉ Số
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => match.player1Id && handleDeclareWinner(match.player1Id)}
                disabled={loading || !match.player1Id}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold"
              >
                {p1Name.split(' ').pop()} Thắng
              </Button>
              <Button
                onClick={() => match.player2Id && handleDeclareWinner(match.player2Id)}
                disabled={loading || !match.player2Id}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold"
              >
                {p2Name.split(' ').pop()} Thắng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

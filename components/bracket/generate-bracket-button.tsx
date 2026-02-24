'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { generateBracket, deleteBracket } from '@/app/actions/bracket'
import { Loader2, Sparkles, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GenerateBracketButtonProps {
  tournamentId: string
  approvedCount: number
  hasBracket: boolean
}

export function GenerateBracketButton({ tournamentId, approvedCount, hasBracket }: GenerateBracketButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      await generateBracket(tournamentId)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ bracket? Hành động này không thể hoàn tác.')) return
    setLoading(true)
    setError('')
    try {
      await deleteBracket(tournamentId)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!hasBracket ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            Đã duyệt <span className="text-yellow-500 font-bold">{approvedCount}</span> người chơi. 
            Số lượng phải là 4, 8, 16 hoặc 32.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-500/20"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Tạo Bracket Tự Động
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Xóa Bracket & Tạo Lại
        </Button>
      )}
    </div>
  )
}

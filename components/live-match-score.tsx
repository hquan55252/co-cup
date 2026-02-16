'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type LiveMatchScoreProps = {
  matchId: string
  initialData: {
    score_p1: number
    score_p2: number
    player1_id: string
    player2_id: string
  }
}

export default function LiveMatchScore({ matchId, initialData }: LiveMatchScoreProps) {
  const [scores, setScores] = useState({
    p1: initialData.score_p1,
    p2: initialData.score_p2,
  })
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          console.log('Change received!', payload)
          const newMatch = payload.new as any
          setScores({
            p1: newMatch.score_p1,
            p2: newMatch.score_p2,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, supabase])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Tỉ Số Trực Tiếp</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center text-4xl font-bold">
        <div className="flex flex-col items-center">
            <span className="text-lg font-normal mb-2">{initialData.player1_id || 'Người chơi 1'}</span>
            <span className="text-blue-600">{scores.p1}</span>
        </div>
        <span className="text-gray-400">-</span>
        <div className="flex flex-col items-center">
            <span className="text-lg font-normal mb-2">{initialData.player2_id || 'Người chơi 2'}</span>
            <span className="text-red-600">{scores.p2}</span>
        </div>
      </CardContent>
    </Card>
  )
}

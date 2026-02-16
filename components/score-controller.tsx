'use client'

import { Button } from "@/components/ui/button"
import { updateScore } from "@/app/tournaments/actions"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type ScoreControllerProps = {
  matchId: string
}

export default function ScoreController({ matchId }: ScoreControllerProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpdate = async (player: 'p1' | 'p2', increment: number) => {
    const actionId = `${player}-${increment > 0 ? 'inc' : 'dec'}`
    setLoading(actionId)
    try {
      await updateScore(matchId, player, increment)
    } catch (error) {
      console.error('Failed to update score', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center p-4 border rounded bg-gray-50 dark:bg-gray-900 mt-4">
      <h3 className="font-semibold">Điều Khiển Tỉ Số</h3>
      <div className="flex gap-8">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-medium">Người chơi 1</span>
          <div className="flex gap-2">
            <Button 
                onClick={() => handleUpdate('p1', 1)} 
                disabled={loading !== null}
                className="bg-blue-600 hover:bg-blue-700"
            >
                {loading === 'p1-inc' ? <Loader2 className="animate-spin h-4 w-4" /> : '+1'}
            </Button>
            <Button 
                onClick={() => handleUpdate('p1', -1)} 
                disabled={loading !== null}
                variant="outline"
            >
                {loading === 'p1-dec' ? <Loader2 className="animate-spin h-4 w-4" /> : '-1'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <span className="font-medium">Người chơi 2</span>
           <div className="flex gap-2">
            <Button 
                onClick={() => handleUpdate('p2', 1)} 
                disabled={loading !== null}
                className="bg-red-600 hover:bg-red-700"
            >
                {loading === 'p2-inc' ? <Loader2 className="animate-spin h-4 w-4" /> : '+1'}
            </Button>
            <Button 
                onClick={() => handleUpdate('p2', -1)} 
                disabled={loading !== null}
                variant="outline"
            >
                 {loading === 'p2-dec' ? <Loader2 className="animate-spin h-4 w-4" /> : '-1'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

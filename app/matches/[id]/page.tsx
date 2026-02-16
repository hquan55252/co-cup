import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import LiveMatchScore from '@/components/live-match-score'
import ScoreController from '@/components/score-controller'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function MatchPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; // await the params first
  const supabase = await createClient()

  // Fetch match details
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!match) {
    notFound()
  }

  // Check if current user is admin to show controller
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      isAdmin = profile?.role === 'admin'
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Link href={`/tournaments/${match.tournament_id}`}>
        <Button variant="ghost" className="mb-4 pl-0 gap-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại Giải Đấu
        </Button>
      </Link>

      <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Chi Tiết Trận Đấu</h1>
            <p className="text-gray-500">Vòng {match.round}</p>
        </div>

        <LiveMatchScore 
            matchId={match.id} 
            initialData={{
                score_p1: match.score_p1, 
                score_p2: match.score_p2,
                player1_id: match.player1_id,
                player2_id: match.player2_id
            }} 
        />

        {isAdmin && (
            <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-center mb-4">Bảng Điều Khiển Admin</h2>
                <ScoreController matchId={match.id} />
            </div>
        )}
      </div>
    </div>
  )
}

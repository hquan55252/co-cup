'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { registerForTournament } from '@/app/actions/tournaments'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface RegisterButtonProps {
  tournamentId: string
  isRegistered: boolean
}

export default function RegisterButton({ tournamentId, isRegistered }: RegisterButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    try {
      const result = await registerForTournament(tournamentId)
      
      if (result.success) {
        setSuccess(true)
        toast({
          title: "Thành công!",
          description: result.message,
          className: "bg-green-600 text-white border-none",
        })
        router.refresh()
      } else {
        toast({
          title: "Lỗi",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isRegistered || success) {
    return (
      <Button size="lg" disabled className="bg-green-600/20 text-green-500 border border-green-600/50 font-bold">
        <CheckCircle2 className="mr-2 w-5 h-5" />
        Đã Đăng Ký
      </Button>
    )
  }

  return (
    <Button 
      size="lg" 
      onClick={handleRegister} 
      disabled={loading}
      className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        'Đăng Ký Ngay'
      )}
    </Button>
  )
}

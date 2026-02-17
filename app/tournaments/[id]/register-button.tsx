'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { registerForTournament } from '@/app/actions/tournaments'
import { Loader2, CheckCircle2, AlertCircle, LogIn, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RegisterButtonProps {
  tournamentId: string
  isRegistered: boolean
  registrationStatus?: string // 'pending' | 'approved' | 'rejected' | null
  isGuest: boolean
  isFull: boolean
}

export default function RegisterButton({ 
  tournamentId, 
  isRegistered, 
  registrationStatus, 
  isGuest,
  isFull 
}: RegisterButtonProps) {
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
          title: "Gửi yêu cầu thành công!",
          description: result.message,
          className: "bg-green-600 text-white border-none",
        })
        router.refresh()
      } else {
        toast({
          title: "Không thể đăng ký",
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

  // 1. Guest View
  if (isGuest) {
    return (
      <Button asChild size="lg" className="w-full sm:w-auto min-w-[200px] h-14 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold border border-slate-700">
        <Link href={`/login?next=/tournaments/${tournamentId}`}>
          <LogIn className="mr-2 w-5 h-5" />
          Đăng Nhập Để Đăng Ký
        </Link>
      </Button>
    )
  }

  // 2. Registered Views
  if (isRegistered || success) {
    if (registrationStatus === 'approved') {
        return (
            <Button size="lg" disabled className="w-full sm:w-auto min-w-[200px] h-14 bg-green-600/20 text-green-500 border border-green-600/50 font-bold opacity-100">
              <CheckCircle2 className="mr-2 w-5 h-5" />
              Đã Tham Gia (Chính Thức)
            </Button>
        )
    }

    if (registrationStatus === 'rejected') {
        return (
            <Button size="lg" disabled className="w-full sm:w-auto min-w-[200px] h-14 bg-red-900/20 text-red-500 border border-red-900/50 font-bold opacity-100">
              <AlertCircle className="mr-2 w-5 h-5" />
              Đăng Ký Bị Từ Chối
            </Button>
        )
    }

    // Default: Pending
    return (
      <Button size="lg" disabled className="w-full sm:w-auto min-w-[200px] h-14 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 font-bold opacity-100">
        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
        Đang Chờ Duyệt...
      </Button>
    )
  }

  // 3. Full / Closed View
  if (isFull) {
    return (
        <Button size="lg" disabled className="w-full sm:w-auto min-w-[200px] h-14 bg-slate-800 text-slate-500 border border-slate-700 font-bold">
          <Lock className="mr-2 w-5 h-5" />
          Giải Đã Đủ Số Lượng
        </Button>
    )
  }

  // 4. Register Action
  return (
    <Button 
      size="lg" 
      onClick={handleRegister} 
      disabled={loading}
      className="w-full sm:w-auto min-w-[200px] h-14 bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02]"
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


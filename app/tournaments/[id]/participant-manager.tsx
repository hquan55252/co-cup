'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2, User, CalendarDays, Eye, Mail } from "lucide-react"
import { manageRegistration } from "@/app/actions/tournaments"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Registration {
  id: string
  userId: string
  status: string
  createdAt: Date
  profile: {
    fullName: string | null
    email: string | null
    avatarUrl: string | null
  }
}

interface ParticipantManagerProps {
  registrations: Registration[]
}

export default function ParticipantManager({ registrations }: ParticipantManagerProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)

  const pending = registrations.filter(r => r.status === 'pending')
  const approved = registrations.filter(r => r.status === 'approved')
  const rejected = registrations.filter(r => r.status === 'rejected')

  const handleAction = async (regId: string, action: 'approved' | 'rejected') => {
    setProcessingId(regId)
    // Optimistic UI updates could be advanced here, but for now loading state is safer for data consistency
    try {
      const result = await manageRegistration(regId, action)
      if (result.success) {
        toast({
          title: "Thành công",
          description: result.message,
          className: "bg-green-600 text-white border-none"
        })
        router.refresh()
      } else {
        toast({
          title: "Lỗi",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch {
       toast({
          title: "Lỗi",
          description: "Không thể xử lý yêu cầu.",
          variant: "destructive"
        })
    } finally {
      setProcessingId(null)
    }
  }

  const RegistrationItem = ({ reg, isPending = false }: { reg: Registration, isPending?: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800 mb-3">
        <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-slate-700">
                <AvatarImage src={reg.profile.avatarUrl || ''} />
                <AvatarFallback className="bg-slate-800 text-slate-400">
                    <User className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-bold text-slate-200">{reg.profile.fullName || "Người dùng ẩn danh"}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(reg.createdAt).toLocaleDateString('vi-VN')}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-2">
             <Button
                size="icon"
                variant="ghost"
                 className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setSelectedReg(reg)}
                title="Xem hồ sơ"
            >
                <Eye className="h-5 w-5" />
            </Button>
            
            {isPending ? (
                <>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-9 w-9 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                        onClick={() => handleAction(reg.id, 'approved')}
                        disabled={!!processingId}
                        title="Duyệt"
                    >
                        {processingId === reg.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-9 w-9 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                         onClick={() => handleAction(reg.id, 'rejected')}
                         disabled={!!processingId}
                         title="Từ chối"
                    >
                         {processingId === reg.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
                    </Button>
                </>
            ) : (
                <Badge variant={reg.status === 'approved' ? 'default' : 'destructive'} className={reg.status === 'approved' ? 'bg-green-600' : 'bg-red-900/50'}>
                    {reg.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                </Badge>
            )}
        </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Pending Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800/50">
            <CardTitle className="text-lg font-bold text-yellow-500 flex items-center justify-between">
                <span>Yêu Cầu Chờ Duyệt</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">{pending.length}</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
            {pending.length > 0 ? (
                pending.map(reg => <RegistrationItem key={reg.id} reg={reg} isPending />)
            ) : (
                <p className="text-slate-500 italic text-center py-4">Không có yêu cầu nào đang chờ xử lý.</p>
            )}
        </CardContent>
      </Card>

       {/* Approved Section */}
       <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800/50">
            <CardTitle className="text-lg font-bold text-green-500 flex items-center justify-between">
                <span>Danh Sách Thi Đấu</span>
                <Badge variant="outline" className="border-green-500 text-green-500">{approved.length}</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 max-h-[400px] overflow-y-auto">
            {approved.length > 0 ? (
                approved.map(reg => <RegistrationItem key={reg.id} reg={reg} />)
            ) : (
                <p className="text-slate-500 italic text-center py-4">Chưa có vận động viên nào.</p>
            )}
        </CardContent>
      </Card>

      {/* Rejected Section (Collapsible or less prominent) */}
       {rejected.length > 0 && (
          <div className="pt-4 border-t border-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Đã từ chối ({rejected.length})</h4>
              {rejected.map(reg => (
                  <div key={reg.id} className="opacity-50 hover:opacity-100 transition-opacity">
                      <RegistrationItem reg={reg} />
                  </div>
              ))}
          </div>
       )}

       {/* Profile Details Dialog */}
      <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-50">
          <DialogHeader>
            <DialogTitle>Hồ Sơ Vận Động Viên</DialogTitle>
            <DialogDescription className="text-slate-400">
                Thông tin chi tiết vận động viên đăng ký giải đấu.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReg && (
            <div className="flex flex-col items-center gap-6 py-4">
                 <Avatar className="h-24 w-24 border-4 border-slate-800 shadow-xl">
                    <AvatarImage src={selectedReg.profile.avatarUrl || ''} />
                    <AvatarFallback className="bg-slate-800 text-slate-400 text-2xl">
                        {selectedReg.profile.fullName?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>
                
                <div className="text-center space-y-2 w-full">
                    <h3 className="text-2xl font-bold text-white">{selectedReg.profile.fullName || "Chưa cập nhật tên"}</h3>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span>{selectedReg.profile.email || "Không có email"}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-2">
                        <CalendarDays className="w-4 h-4" />
                        <span>Đăng ký: {new Date(selectedReg.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 mt-4">
                    {selectedReg.status === 'pending' && (
                        <>
                             <Button 
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                    handleAction(selectedReg.id, 'approved')
                                    setSelectedReg(null)
                                }}
                            >
                                <Check className="w-4 h-4 mr-2" /> Duyệt
                            </Button>
                            <Button 
                                variant="destructive" 
                                className="w-full"
                                onClick={() => {
                                    handleAction(selectedReg.id, 'rejected')
                                    setSelectedReg(null)
                                }}
                            >
                                <X className="w-4 h-4 mr-2" /> Từ chối
                            </Button>
                        </>
                    )}
                     {selectedReg.status !== 'pending' && (
                        <div className="col-span-2 flex justify-center">
                             <Badge variant={selectedReg.status === 'approved' ? 'default' : 'destructive'} className="text-base px-4 py-1">
                                {selectedReg.status === 'approved' ? 'Đã được chấp thuận' : 'Đã bị từ chối'}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

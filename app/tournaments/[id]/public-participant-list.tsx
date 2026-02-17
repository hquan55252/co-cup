import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ShieldCheck } from "lucide-react"

interface Registration {
  id: string
  userId: string
  status: string
  createdAt: Date
  profile: {
    fullName: string | null
    avatarUrl: string | null
  }
}

interface PublicParticipantListProps {
  registrations: Registration[]
}

export default function PublicParticipantList({ registrations }: PublicParticipantListProps) {
  // Only show approved registrations
  const approved = registrations.filter(r => r.status === 'approved')

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-200">Danh Sách Vận Động Viên</h3>
            <div className="px-3 py-1 bg-green-900/30 text-green-500 rounded-full text-sm font-medium border border-green-900/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {approved.length} Chính Thức
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.length > 0 ? (
                approved.map((reg, index) => (
                    <Card key={reg.id} className="bg-slate-900 border-slate-800 hover:border-yellow-500/30 transition-all group overflow-hidden relative">
                         <div className="absolute top-2 right-2 text-slate-700 font-black text-4xl opacity-10 select-none group-hover:text-yellow-500 group-hover:opacity-20 transition-all">
                             #{index + 1}
                         </div>
                        <CardContent className="p-4 flex items-center gap-4 relative z-10">
                            <Avatar className="w-14 h-14 border-2 border-slate-700 group-hover:border-yellow-500 transition-colors shadow-lg">
                                <AvatarImage src={reg.profile.avatarUrl || ''} />
                                <AvatarFallback className="bg-slate-800 text-yellow-500 font-bold text-lg">
                                    {reg.profile.fullName?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-slate-200 text-lg group-hover:text-yellow-500 transition-colors line-clamp-1">
                                    {reg.profile.fullName || "Vận Động Viên"}
                                </p>
                                <p className="text-xs text-slate-500">Tham gia: {new Date(reg.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="col-span-full bg-slate-900 border-slate-800 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center">
                             <User className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-lg">Chưa có vận động viên nào được duyệt.</p>
                    </div>
                </Card>
            )}
        </div>
    </div>
  )
}

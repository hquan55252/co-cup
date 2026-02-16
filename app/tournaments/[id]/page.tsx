import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Trophy, Shield, Share2, Settings, ArrowRight, User, Clock, CheckCircle2 } from "lucide-react"
import RegisterButton from "./register-button"

export const dynamic = 'force-dynamic'

interface TournamentDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TournamentDetailsPage({ params }: TournamentDetailsPageProps) {
  const { id } = await params
  
  // 1. Fetch Tournament Data
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      creator: true,
      _count: {
        select: { registrations: true }
      },
      registrations: {
        include: {
          profile: true
        }
      }
    }
  })

  if (!tournament) {
    notFound()
  }

  // 2. Get Current User for Permissions
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const isCreator = user?.id === tournament.creatorId
  const isRegistering = tournament.status === 'REGISTERING'

  let isRegistered = false
  if (user) {
    // Check if the current user is in the list of registrations
    isRegistered = tournament.registrations.some(reg => reg.userId === user.id)
  }

  // Format Dates
  const startDate = new Date(tournament.startDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const deadline = new Date(tournament.deadline).toLocaleDateString('vi-VN', {
     hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric'
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 pb-20">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full group overflow-hidden">
        {/* Banner with gradient overlay */}
        <div className="absolute inset-0">
             <Image 
              src={tournament.bannerUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2669&auto=format&fit=crop"}
              alt={tournament.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 container pb-16 z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-6 max-w-4xl">
                     {/* Status Badge & Meta */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className={`
                            px-4 py-1.5 text-sm font-bold uppercase tracking-wider border-none rounded-full shadow-lg
                            ${tournament.status === 'REGISTERING' ? 'bg-green-500 text-slate-950' : 
                              tournament.status === 'CONFIRMED' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}
                        `}>
                            {tournament.status === 'REGISTERING' ? 'Đang Mở Đăng Ký' : tournament.status}
                        </Badge>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                            Mùa Giải 2024
                        </Badge>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl leading-none">
                            {tournament.name}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl line-clamp-2">
                            {tournament.description?.slice(0, 150) || "Giải đấu cầu lông chuyên nghiệp dành cho mọi đối tượng..."}
                        </p>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4 text-sm md:text-base">
                        <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-colors">
                             <Calendar className="w-5 h-5 text-yellow-500" />
                             <span className="text-slate-200 font-medium">{startDate}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-colors">
                             <MapPin className="w-5 h-5 text-yellow-500" />
                             <span className="text-slate-200 font-medium">{tournament.location || "Online / TBD"}</span>
                        </div>
                         <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-colors">
                             <Users className="w-5 h-5 text-yellow-500" />
                             <span className="text-slate-200 font-medium">{tournament._count.registrations} / {tournament.maxPlayers} Vận Động Viên</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto min-w-[200px]">
                    {isCreator ? (
                        <Button size="lg" className="w-full h-14 bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold text-lg shadow-lg shadow-yellow-500/20">
                            <Settings className="mr-2 w-5 h-5" />
                            Quản Lý Giải
                        </Button>
                    ) : (
                        isRegistering && (
                            <div className="w-full">
                                <RegisterButton tournamentId={tournament.id} isRegistered={isRegistered} />
                            </div>
                        )
                    )}
                    <Button variant="outline" size="lg" className="w-full h-14 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm">
                        <Share2 className="mr-2 w-5 h-5" />
                        Chia Sẻ
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Main Content Tabs */}
      <div className="container relative z-20 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Details (8 cols) */}
            <div className="lg:col-span-8">
                <Tabs defaultValue="overview" className="w-full space-y-8">
                    <TabsList className="bg-slate-900/90 backdrop-blur border border-white/10 p-1.5 w-full justify-start h-auto rounded-2xl shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950 text-slate-400 py-3 rounded-xl font-bold transition-all">
                            Tổng Quan
                        </TabsTrigger>
                        <TabsTrigger value="bracket" className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950 text-slate-400 py-3 rounded-xl font-bold transition-all">
                            Sơ Đồ & Lịch Đấu
                        </TabsTrigger>
                        <TabsTrigger value="teams" className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950 text-slate-400 py-3 rounded-xl font-bold transition-all">
                             Vận Động Viên ({tournament._count.registrations})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
                        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                            <CardHeader className="border-b border-slate-800/50 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl text-yellow-500">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    Giới Thiệu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                                {tournament.description || "Chưa có mô tả chi tiết cho giải đấu này."}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                             <CardHeader className="border-b border-slate-800/50 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl text-yellow-500">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    Điều Lệ & Quy Định
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                                {tournament.rules || "BTC chưa cập nhật điều lệ chi tiết."}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bracket" className="animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
                        <Card className="bg-slate-900 border-slate-800 shadow-xl min-h-[400px] flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                            <div className="text-center text-slate-500 relative z-10 p-8">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                     <Trophy className="w-10 h-10 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-300 mb-2">Chưa Công Bố Sơ Đồ</h3>
                                <p className="max-w-md mx-auto">Sơ đồ thi đấu sẽ được Ban Tổ Chức công bố sau khi kết thúc thời gian đăng ký. Vui lòng quay lại sau.</p>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="teams" className="animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tournament.registrations.length > 0 ? (
                                tournament.registrations.map((reg) => (
                                    <Card key={reg.id} className="bg-slate-900 border-slate-800 hover:border-yellow-500/30 transition-all group">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-slate-700 group-hover:border-yellow-500 transition-colors">
                                                <AvatarImage src={reg.profile.avatarUrl || ''} />
                                                <AvatarFallback className="bg-slate-800 text-yellow-500 font-bold">
                                                    {reg.profile.fullName?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-slate-200 group-hover:text-yellow-500 transition-colors">
                                                    {reg.profile.fullName || "Vận Động Viên"}
                                                </p>
                                                <p className="text-xs text-slate-500">Đăng ký: {new Date(reg.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="col-span-full bg-slate-900 border-slate-800 py-12 text-center text-slate-500">
                                    <p>Chưa có vận động viên nào đăng ký.</p>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Column: Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Host Info Card */}
                <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                    <div className="h-20 bg-gradient-to-r from-yellow-600 to-yellow-400 relative">
                        <div className="absolute -bottom-8 left-6">
                            <Avatar className="w-20 h-20 border-4 border-slate-900 shadow-lg">
                            <AvatarImage src={tournament.creator.avatarUrl || ''} />
                                <AvatarFallback className="bg-slate-800 text-yellow-500 text-2xl font-bold">
                                    {tournament.creator.fullName?.[0] || 'A'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <CardContent className="pt-16 pb-8 px-6 text-center">
                        <h3 className="text-xl font-bold text-white mb-1">
                            {tournament.creator.fullName || "Admin"}
                        </h3>
                        <p className="text-yellow-500 font-medium mb-6">Nhà Tổ Chức</p>
                        
                        <div className="space-y-3">
                             {tournament.contactInfo && (
                                <div className="text-sm text-slate-400 bg-slate-950/30 p-3 rounded-lg border border-slate-800/50 mb-4">
                                    {tournament.contactInfo}
                                </div>
                             )}
                             <Button className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold h-11">
                                 Xem Trang Cá Nhân
                             </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline Card */}
                 <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                    <CardHeader className="bg-slate-950/30 border-b border-slate-800/50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            Tiến Độ Giải Đấu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="relative space-y-0">
                            {/* Connector Line */}
                            <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-800" />

                            {/* Event 1: Registering */}
                            <div className="relative flex gap-4 pb-8 group">
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                    isRegistering ? 'bg-slate-900 border-yellow-500 text-yellow-500' : 'bg-slate-900 border-green-500 text-green-500'
                                }`}>
                                   {isRegistering ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                </div>
                                <div className="pt-1">
                                    <h4 className={`font-bold text-base ${isRegistering ? 'text-yellow-500' : 'text-slate-300'}`}>Mở Đăng Ký</h4>
                                    <p className="text-sm text-slate-500 mt-1">Hạn chót: {deadline}</p>
                                </div>
                            </div>

                             {/* Event 2: Bracket */}
                            <div className="relative flex gap-4 pb-8 group">
                                <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 border-slate-700 bg-slate-900 text-slate-500">
                                   <Trophy className="w-5 h-5" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-slate-400 text-base">Công Bố Bảng Đấu</h4>
                                    <p className="text-sm text-slate-500 mt-1">Sau khi đóng cổng đăng ký</p>
                                </div>
                            </div>

                             {/* Event 3: Start */}
                            <div className="relative flex gap-4 group">
                                <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 border-slate-700 bg-slate-900 text-slate-500">
                                   <Calendar className="w-5 h-5" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-slate-400 text-base">Khởi Tranh</h4>
                                    <p className="text-sm text-slate-500 mt-1">{startDate}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </main>
  )
}

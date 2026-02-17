import { prisma } from "@/lib/prisma"
import { getTournamentStatusLabel } from "@/lib/utils"
import { TournamentStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight, Calendar, Users, Trophy, SearchX, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TournamentFilter } from "./tournament-filter"

export const dynamic = 'force-dynamic'

interface TournamentsPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
  }>
}

export default async function TournamentsPage({ searchParams }: TournamentsPageProps) {
  const { q: query, status: statusParam } = await searchParams
  const status = statusParam as TournamentStatus | undefined

  const whereClause: any = {}

  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (status && status !== 'ALL' as any) {
    whereClause.status = status
  }

  const tournaments = await prisma.tournament.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container max-w-7xl mx-auto">
            
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="space-y-4 max-w-2xl">
                    <Badge variant="outline" className="border-yellow-500/20 text-yellow-500 bg-yellow-500/5 px-3 py-1 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 mr-2" />
                        Mùa Giải 2024-2025
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Khám Phá <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Các Giải Đấu Đỉnh Cao</span>
                    </h1>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="h-12 px-6 bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-full transition-all">
                        <Link href="/tournaments/new">
                            Tạo Giải Đấu
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Integrated Filter Bar */}
            <div className="sticky top-24 z-40 mb-12">
                 <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-2xl ring-1 ring-white/10">
                    <TournamentFilter />
                 </div>
            </div>

            {/* Results Grid - Clean Card Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.length > 0 ? (
                tournaments.map((t) => (
                <Link key={t.id} href={`/tournaments/${t.id}`} className="group flex flex-col gap-4">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-lg group-hover:shadow-yellow-500/10 group-hover:border-yellow-500/30 transition-all duration-500">
                        <Image 
                            src={t.bannerUrl || "https://images.unsplash.com/photo-1519766304800-c9519d1fcfac?q=80&w=2500&auto=format&fit=crop"}
                            alt={t.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500" />
                        
                        <div className="absolute top-4 left-4">
                             <Badge className={`border-none shadow-sm backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold ${
                                t.status === 'REGISTERING' ? 'bg-green-500 text-slate-950' : 
                                t.status === 'CONFIRMED' ? 'bg-blue-500 text-white' : 
                                t.status === 'COMPLETED' ? 'bg-slate-800 text-slate-400' : 'bg-slate-700 text-white'
                            }`}>
                                {getTournamentStatusLabel(t.status)}
                            </Badge>
                        </div>
                    </div>
                    
                    {/* Minimal Content */}
                    <div className="space-y-2 px-1">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(t.startDate).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                32 Teams
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors line-clamp-1">
                            {t.name}
                        </h3>

                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">{t.location || "Chưa cập nhật địa điểm"}</span>
                        </div>
                    </div>
                </Link>
                ))
            ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <SearchX className="h-8 w-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy giải đấu</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">
                        Chúng tôi không tìm thấy giải đấu nào phù hợp với bộ lọc hiện tại của bạn.
                    </p>
                    <Button 
                        variant="secondary" 
                        asChild
                        className="rounded-full font-bold"
                    >
                        <Link href="/tournaments">Xóa bộ lọc tìm kiếm</Link>
                    </Button>
                </div>
            )}
            </div>
        </div>
      </div>
    </main>
  )
}

import { prisma } from "@/lib/prisma"
import { TournamentStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TournamentFilter } from "./tournament-filter"

export const dynamic = 'force-dynamic'

interface TournamentsPageProps {
  searchParams: {
    q?: string
    status?: string
  }
}

export default async function TournamentsPage({ searchParams }: TournamentsPageProps) {
  const query = searchParams.q
  const status = searchParams.status as TournamentStatus | undefined

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
    <main className="min-h-screen bg-slate-950 text-slate-50 py-12">
      <div className="container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Giải Đấu</h1>
            <p className="text-slate-400">Tìm kiếm và tham gia các giải đấu cầu lông hấp dẫn.</p>
          </div>
          <Button asChild className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold">
            <Link href="/tournaments/new">
              Tạo Giải Đấu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <TournamentFilter />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.length > 0 ? (
            tournaments.map((t) => (
              <Link key={t.id} href={`/tournaments/${t.id}`} className="group relative block h-80 rounded-2xl overflow-hidden border border-slate-800 hover:border-yellow-500/50 transition-all">
                <Image 
                    src={t.bannerUrl || "https://images.unsplash.com/photo-1519766304800-c9519d1fcfac?q=80&w=2500&auto=format&fit=crop"}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex justify-between items-center mb-3">
                        <Badge variant="outline" className={`border-slate-700 text-xs backdrop-blur-md ${
                            t.status === 'REGISTERING' ? 'text-green-400 bg-green-400/10' : 
                            t.status === 'CONFIRMED' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400'
                        }`}>
                            {t.status}
                        </Badge>
                        <span className="text-xs text-slate-300 font-medium bg-slate-900/50 px-2 py-1 rounded">
                            {new Date(t.startDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2">
                          {t.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{t.location || "TBA"}</span>
                      </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-500">
                <p className="text-lg">Không tìm thấy giải đấu nào.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

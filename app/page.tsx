import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, ArrowRight, MapPin, Ticket } from 'lucide-react'
import { prisma } from "@/lib/prisma"
import Image from 'next/image'
import { TournamentStatus } from '@prisma/client'
import { getTournamentStatusLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2500&auto=format&fit=crop"
            alt="Stadium Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950"></div>
        </div>

        <div className="container relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 px-4 py-1.5 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
                <span className="text-yellow-500 font-bold text-sm tracking-wider uppercase">Mùa Giải 2024-2025</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
                NỀN TẢNG <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">CẦU LÔNG ĐỈNH CAO</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 max-w-4xl mx-auto mb-10 font-normal leading-relaxed">
                Kết nối đam mê, nâng tầm giải đấu. <br className="hidden md:block" />
                Dành cho cả <strong>Vận Động Viên</strong> thi đấu và <strong>Nhà Tổ Chức</strong> chuyên nghiệp.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold text-lg h-14 px-8 rounded-full shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105">
                    <Link href="/tournaments">Tìm Giải Đấu</Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-950 font-bold text-lg h-14 px-8 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-105">
                     <Link href="/tournaments/new">Tạo Giải Đấu</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Stats Stripe */}
      {/* Stats Stripe */}
      <section className="relative z-20 -mt-20">
          <div className="container">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-12 px-6 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    <div className="group">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-1 group-hover:text-yellow-500 transition-colors">32</h3>
                        <p className="text-slate-400 font-bold uppercase text-xs md:text-sm tracking-wider">Đội Thi Đấu</p>
                    </div>
                    <div className="group">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-1 group-hover:text-yellow-500 transition-colors">500+</h3>
                        <p className="text-slate-400 font-bold uppercase text-xs md:text-sm tracking-wider">Vận Động Viên</p>
                    </div>
                    <div className="group">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-1 group-hover:text-yellow-500 transition-colors">8</h3>
                        <p className="text-slate-400 font-bold uppercase text-xs md:text-sm tracking-wider">Địa Điểm</p>
                    </div>
                    <div className="group">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-1 group-hover:text-yellow-500 transition-colors">50M+</h3>
                        <p className="text-slate-400 font-bold uppercase text-xs md:text-sm tracking-wider">Tổng Giải Thưởng</p>
                    </div>
                </div>
            </div>
          </div>
      </section>

      {/* Tournaments List Section */}
      <section className="container py-24 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-6">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2">Lịch Thi Đấu</h2>
                <p className="text-slate-400">Các giải đấu sắp diễn ra trong tháng này</p>
            </div>
            <Button variant="link" className="text-yellow-500 hover:text-yellow-400 p-0">
                Xem Tất Cả Lịch Trình <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>

        <div className="space-y-4">
            {tournaments.map((t) => (
                <Link href={`/tournaments/${t.id}`} key={t.id} className="group relative bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 hover:border-yellow-500/50 transition-all hover:bg-slate-800/50 cursor-pointer">
                    {/* Date Box */}
                    <div className="flex-shrink-0 w-full md:w-24 h-24 bg-slate-950 rounded-lg flex flex-col items-center justify-center border border-slate-800 group-hover:border-yellow-500 transition-colors">
                        <span className="text-3xl font-bold text-white">{new Date(t.startDate).getDate()}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tháng {new Date(t.startDate).getMonth() + 1}</span>
                    </div>

                    {/* Tournament Info */}
                    <div className="flex-grow text-center md:text-left space-y-2">
                         <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                            <Badge variant="outline" className={`border-slate-700 text-xs ${
                                t.status === 'REGISTERING' ? 'text-green-400 bg-green-400/10' : 
                                t.status === 'CONFIRMED' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400'
                            }`}>
                                {getTournamentStatusLabel(t.status)}
                            </Badge>
                         </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                            {t.name}
                        </h3>
                         <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                {t.location || "Chưa cập nhật địa điểm"}
                            </div>
                            <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-slate-500" />
                                32 Đội tham gia
                            </div>
                         </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                        <Button size="lg" className="bg-white text-slate-950 hover:bg-yellow-500 font-bold rounded-full transition-all">
                            <Ticket className="mr-2 h-4 w-4" />
                            Đăng Ký Ngay
                        </Button>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Organizer Features Section */}
      <section className="bg-slate-900 border-y border-slate-800 py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="container relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  <div className="flex-1 space-y-8">
                      <div>
                          <Badge className="mb-4 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20 px-4 py-1">Dành Cho Nhà Tổ Chức</Badge>
                          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                              TỔ CHỨC GIẢI ĐẤU <br />
                              <span className="text-yellow-500">CHUYÊN NGHIỆP</span>
                          </h2>
                          <p className="text-slate-400 text-lg leading-relaxed">
                              Hệ thống quản lý giải đấu toàn diện giúp bạn tiết kiệm 90% thời gian vận hành. Từ tạo lịch thi đấu, quản lý đội thi, đến cập nhật kết quả realtime.
                          </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-yellow-500/30 transition-colors">
                              <Trophy className="h-10 w-10 text-yellow-500 mb-4" />
                              <h3 className="text-xl font-bold text-white mb-2">Tạo Bracket Tự Động</h3>
                              <p className="text-slate-400 text-sm">Hỗ trợ Single Elimination, Double Elimination và Round Robin.</p>
                          </div>
                          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-yellow-500/30 transition-colors">
                              <Users className="h-10 w-10 text-blue-500 mb-4" />
                              <h3 className="text-xl font-bold text-white mb-2">Quản Lý Vận Động Viên</h3>
                              <p className="text-slate-400 text-sm">Hồ sơ VĐV chi tiết, lịch sử thi đấu và xếp hạng ELO.</p>
                          </div>
                      </div>

                      <div className="pt-4">
                           <Button asChild size="lg" className="h-14 px-8 bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold text-lg rounded-full shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105">
                                <Link href="/tournaments/new">
                                    Bắt Đầu Tạo Giải
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                           </Button>
                      </div>
                  </div>
                  
                  <div className="flex-1 relative">
                      <div className="relative z-10 bg-slate-800 rounded-2xl p-2 shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-700">
                          <Image 
                             src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2670&auto=format&fit=crop" 
                             alt="Tournament Management Dashboard" 
                             width={600} 
                             height={400} 
                             className="rounded-xl border border-slate-700 w-full h-auto object-cover"
                          />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Featured Teams / Grid Section */}
      <section className="bg-slate-950 py-24">
         <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Giải Đấu <span className="text-yellow-500">Nổi Bật</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Khám phá các giải đấu được quan tâm nhất hiện nay.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tournaments.slice(0, 3).map((t) => (
                    <Link key={t.id} href={`/tournaments/${t.id}`} className="group relative block h-80 rounded-2xl overflow-hidden">
                        <Image 
                            src={t.bannerUrl || "https://images.unsplash.com/photo-1519766304800-c9519d1fcfac?q=80&w=2500&auto=format&fit=crop"}
                            alt={t.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                             <div className="flex justify-between items-start mb-4">
                                <div className="text-yellow-500 font-bold text-sm uppercase tracking-wider">
                                    {getTournamentStatusLabel(t.status)}
                                </div>
                                <div className="bg-slate-900/80 backdrop-blur p-2 rounded-lg text-center min-w-[60px]">
                                    <span className="block text-xl font-bold text-white leading-none">{new Date(t.startDate).getDate()}</span>
                                    <span className="block text-xs text-slate-400 uppercase">Thg {new Date(t.startDate).getMonth() + 1}</span>
                                </div>
                             </div>
                             <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-500 transition-colors">
                                 {t.name}
                             </h3>
                             <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <MapPin className="h-4 w-4" />
                                {t.location || "TBA"}
                             </div>
                        </div>
                    </Link>
                ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-3xl p-12 md:p-20 relative overflow-hidden">
                 {/* Decorative background pattern could go here */}
                 <div className="relative z-10 max-w-2xl mx-auto">
                     <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6">SẴN SÀNG THI ĐẤU?</h2>
                     <p className="text-xl text-slate-900 mb-8 font-medium">
                         Đăng ký đội của bạn ngay hôm nay và trở thành một phần của giải đấu lớn nhất năm.
                     </p>
                     <Button size="lg" className="h-16 px-10 text-lg bg-slate-950 text-white hover:bg-slate-800 rounded-full font-bold shadow-2xl">
                        <Link href="/tournaments/new">Đăng Ký Ngay</Link>
                     </Button>
                 </div>
            </div>
      </section>
    </main>
  );
}

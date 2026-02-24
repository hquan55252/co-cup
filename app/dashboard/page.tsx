import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, ArrowRight, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  if (!stats) {
     redirect('/login');
  }

  const { user, profile, hostedCount, joinedCount, recentHosted } = stats;
  const displayName = profile.fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || "User";

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Xin chào, {displayName}! 👋</h1>
            <p className="text-slate-400">Chào mừng trở lại bảng điều khiển của bạn.</p>
        </div>
        <Button asChild className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold shadow-lg shadow-yellow-500/20">
            <Link href="/tournaments/new">
                <Plus className="mr-2 h-4 w-4" />
                Tạo Giải Mới
            </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-yellow-500/30 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-yellow-500 transition-colors">Giải Đấu Đã Tạo</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white">{hostedCount}</div>
                <p className="text-xs text-slate-500 mt-1">Giải đấu bạn tổ chức</p>
            </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-blue-500/30 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-blue-500 transition-colors">Giải Đã Tham Gia</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white">{joinedCount}</div>
                <p className="text-xs text-slate-500 mt-1">Giải đấu bạn tham gia thi đấu</p>
            </CardContent>
        </Card>
         <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-green-500/30 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-green-500 transition-colors">Trận Đấu Sắp Tới</CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white">0</div>
                <p className="text-xs text-slate-500 mt-1">Tính năng đang phát triển</p>
            </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Giải Đấu Của Bạn
                    </h3>
                    <Button variant="link" className="text-yellow-500 p-0 h-auto" asChild>
                        <Link href="/dashboard/hosted">Xem tất cả</Link>
                    </Button>
                </div>
                
                {recentHosted.length > 0 ? (
                    <div className="space-y-4">
                        {recentHosted.map(tournament => (
                            <Link href={`/tournaments/${tournament.id}`} key={tournament.id}>
                                <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 flex items-center justify-between group hover:border-yellow-500/50 hover:bg-slate-900 transition-all cursor-pointer">
                                    <div>
                                        <h4 className="font-bold text-slate-200 group-hover:text-yellow-500 transition-colors line-clamp-1">{tournament.name}</h4>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {new Date(tournament.startDate).toLocaleDateString('vi-VN')} • {tournament._count?.registrations || 0} VĐV
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-yellow-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                         <p className="text-slate-400 mb-4">Bạn chưa tạo giải đấu nào.</p>
                         <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-950" asChild>
                            <Link href="/tournaments/new">Tạo giải ngay</Link>
                         </Button>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Lịch Thi Đấu
                    </h3>
                    {/* <Button variant="link" className="text-blue-500 p-0 h-auto">Chi tiết</Button> */}
                </div>

                 <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                        <h4 className="text-slate-300 font-medium">Chưa có lịch thi đấu</h4>
                        <p className="text-sm text-slate-500 mt-1 max-w-[250px] mx-auto">
                            Lịch thi đấu sẽ xuất hiện khi bạn tham gia giải và có kết quả bốc thăm.
                        </p>
                    </div>
                 </div>
            </div>
      </div>
    </div>
  );
}

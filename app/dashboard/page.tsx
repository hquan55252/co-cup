import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Xin chào, Chad! 👋</h1>
        <p className="text-slate-400">Chào mừng trở lại bảng điều khiển của bạn.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Giải Đấu Đã Tạo</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-slate-500 mt-1">2 giải đang diễn ra</p>
            </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Giải Đã Tham Gia</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-slate-500 mt-1">+2 trong tháng này</p>
            </CardContent>
        </Card>
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Trận Đấu Sắp Tới</CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">5</div>
                <p className="text-xs text-slate-500 mt-1">Trận gần nhất: Hôm nay 14:00</p>
            </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Next Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg">Giải Đấu Của Bạn</h3>
                    <Button variant="link" className="text-yellow-500 p-0 h-auto">Xem tất cả</Button>
                </div>
                
                {/* Placeholder List */}
                <div className="space-y-4">
                    <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 flex items-center justify-between group hover:border-yellow-500/30 transition-colors">
                        <div>
                            <h4 className="font-bold text-slate-200">Giải Cầu Lông Mở Rộng HCM 2024</h4>
                            <p className="text-sm text-slate-500">32 VĐV • Đang mở đăng ký</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">Quản Lý</Button>
                    </div>
                </div>
                
                 <div className="mt-4 pt-4 border-t border-slate-800">
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 border-dashed">
                        + Tạo Giải Đấu Mới
                    </Button>
                 </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg">Lịch Thi Đấu</h3>
                    <Button variant="link" className="text-blue-500 p-0 h-auto">Chi tiết</Button>
                </div>

                 <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-slate-950 rounded-lg flex flex-col items-center justify-center border border-slate-800 flex-shrink-0">
                            <span className="text-xl font-bold text-white">14</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">THG 6</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-200">Bạn vs Nguyễn Văn A</h4>
                            <p className="text-sm text-slate-400">Vòng Loại - Giải HCM Open</p>
                             <div className="text-xs text-yellow-500 mt-1 px-2 py-0.5 bg-yellow-500/10 rounded inline-block">
                                14:00 - Sân số 3
                             </div>
                        </div>
                    </div>
                 </div>
            </div>
      </div>
    </div>
  );
}

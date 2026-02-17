import { getHostedTournaments } from "@/app/actions/tournaments";
import { HostedTournamentCard } from "@/components/dashboard/hosted-tournament-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default async function HostedTournamentsPage() {
  const tournaments = await getHostedTournaments();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Giải Đấu Của Tôi</h1>
           <p className="text-slate-400">Quản lý các giải đấu do bạn tổ chức.</p>
        </div>
        <Button asChild className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold">
            <Link href="/tournaments/new">
                <Plus className="mr-2 h-4 w-4" />
                Tạo Giải Mới
            </Link>
        </Button>
      </div>

      {tournaments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tournaments.map((tournament) => (
                <HostedTournamentCard key={tournament.id} tournament={tournament} />
            ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Chưa có giải đấu nào</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
                Bạn chưa tổ chức giải đấu nào. Hãy bắt đầu tạo giải đấu đầu tiên của bạn ngay hôm nay!
            </p>
            <Button asChild className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold">
                <Link href="/tournaments/new">
                    Tạo Giải Đấu Ngay
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}

import { getJoinedTournaments } from "@/app/actions/tournaments";
import { JoinedTournamentCard } from "@/components/dashboard/joined-tournament-card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default async function JoinedTournamentsPage() {
  const registrations = await getJoinedTournaments();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Giải Đấu Đã Tham Gia</h1>
           <p className="text-slate-400">Theo dõi trạng thái đăng ký và lịch thi đấu của bạn.</p>
        </div>
        <Button asChild className="bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold border border-slate-700">
            <Link href="/tournaments">
                <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                Tìm Giải Đấu Mới
            </Link>
        </Button>
      </div>

      {registrations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {registrations.map((reg) => (
                <JoinedTournamentCard key={reg.id} registration={reg} />
            ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Chưa tham gia giải đấu nào</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
                Bạn chưa đăng ký tham gia giải đấu nào. Hãy tìm kiếm thử thách mới ngay!
            </p>
            <Button asChild className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold">
                <Link href="/tournaments">
                    Tìm Kiếm Giải Đấu
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}

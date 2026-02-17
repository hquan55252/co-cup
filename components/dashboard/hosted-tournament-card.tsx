import Link from "next/link";
import { getTournamentStatusLabel } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Settings, 
  ExternalLink 
} from "lucide-react";

export function HostedTournamentCard({ tournament }: { tournament: any }) {
  const isRegistering = tournament.status === 'REGISTERING';
  const isConfirmed = tournament.status === 'CONFIRMED';
  const isCompleted = tournament.status === 'COMPLETED';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all group">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
           <Image 
              src={tournament.bannerUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2669&auto=format&fit=crop"}
              alt={tournament.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2">
                 <Badge className={`
                    text-xs font-bold uppercase tracking-wider border-none
                    ${isRegistering ? 'bg-green-500 text-slate-950' : 
                      isConfirmed ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}
                `}>
                    {isRegistering ? 'Đang Mở Đăng Ký' : getTournamentStatusLabel(tournament.status)}
                </Badge>
            </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-yellow-500 transition-colors">
                        {tournament.name}
                    </h3>
                </div>
                
                <div className="space-y-2 mb-4">
                     <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>{new Date(tournament.startDate).toLocaleDateString('vi-VN')}</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="line-clamp-1">{tournament.location || "Chưa cập nhật địa điểm"}</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span>{tournament._count?.registrations || 0} / {tournament.maxPlayers} VĐV</span>
                     </div>
                </div>
            </div>

            <div className="flex gap-3 mt-auto pt-4 border-t border-slate-800">
                <Button asChild size="sm" className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold flex-1">
                    <Link href={`/tournaments/${tournament.id}`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Quản Lý
                    </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                    <Link href={`/tournaments/${tournament.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

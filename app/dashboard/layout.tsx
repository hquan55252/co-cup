import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Trophy, 
  Calendar, 
  User, 
  LogOut, 
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile for avatar/name
  // In a real app, you might want to fetch this from your own DB to get the custom profile data
  // For now, we'll just rely on what we have or a placeholder

  const navItems = [
    { href: "/dashboard", label: "Tổng Quan", icon: LayoutDashboard },
    { href: "/dashboard/hosted", label: "Giải Đấu Của Tôi", icon: Trophy },
    { href: "/dashboard/joined", label: "Giải Đã Tham Gia", icon: Calendar },
    { href: "/dashboard/profile", label: "Hồ Sơ Cá Nhân", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar - Add pt-24 so the content starts below the fixed navbar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col pt-24">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <Avatar className="h-12 w-12 border-2 border-yellow-500">
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback className="bg-slate-800 text-yellow-500 font-bold">
                        {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-white truncate">{user.user_metadata.full_name || user.email}</h3>
                    <p className="text-xs text-slate-400 truncate">Vận Động Viên</p>
                </div>
            </div>

            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>

        <div className="p-6 mt-auto border-t border-slate-800">
             <form action="/auth/signout" method="post">
                <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-3">
                    <LogOut className="h-5 w-5" />
                    Đăng Xuất
                </Button>
            </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}

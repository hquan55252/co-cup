'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, Trophy, Calendar, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserNav({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (!user) {
    return (
      <div className="flex gap-2">
         <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 font-medium">Đăng Nhập</Button>
         </Link>
         <Link href="/auth/sign-up">
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-500/20">Đăng Ký</Button>
         </Link>
      </div>
    )
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initial = displayName[0]?.toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/20 hover:bg-white/10 p-0 overflow-hidden">
            <Avatar className="h-full w-full">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-slate-800 text-white font-bold">{initial}</AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-slate-900 border-slate-800 text-slate-200" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-bold text-white leading-none">{displayName}</p>
            <p className="text-xs leading-none text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        
        <DropdownMenuItem asChild>
             <Link href="/dashboard" className="w-full cursor-pointer flex items-center p-3 hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-md">
                <LayoutDashboard className="mr-3 h-4 w-4 text-blue-500" />
                <span>Bảng Điều Khiển</span>
             </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
             <Link href="/dashboard/profile" className="w-full cursor-pointer flex items-center p-3 hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-md">
                <User className="mr-3 h-4 w-4 text-purple-500" />
                <span>Hồ Sơ Cá Nhân</span>
             </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
            <Link href="/dashboard/hosted" className="w-full cursor-pointer flex items-center p-3 hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-md">
                <Trophy className="mr-3 h-4 w-4 text-yellow-500" />
                <span>Giải Đấu Của Tôi</span>
            </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
            <Link href="/dashboard/joined" className="w-full cursor-pointer flex items-center p-3 hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-md">
                <Calendar className="mr-3 h-4 w-4 text-green-500" />
                <span>Giải Đã Tham Gia</span>
            </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-800" />
        
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 p-3 cursor-pointer rounded-md">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Đăng Xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

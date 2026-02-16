import Link from "next/link"
import { Trophy } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <span className="inline-block font-bold text-xl text-white tracking-wide">
            Cầu Lông <span className="text-yellow-500">Master</span>
        </span>
      </Link>
      <nav className="flex gap-6 items-center">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Trang Chủ
        </Link>
        <Link
          href="/tournaments"
          className="flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Giải Đấu
        </Link>
        <Link
          href="/rankings"
          className="flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors opacity-50 cursor-not-allowed"
          title="Coming Soon"
        >
          Bảng Xếp Hạng
        </Link>
      </nav>
    </div>
  )
}

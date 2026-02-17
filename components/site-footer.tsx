import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
            <h3 className="text-xl font-black text-white tracking-tighter">
                CO<span className="text-yellow-500">CUP</span>
            </h3>
            <p className="text-sm leading-relaxed">
                Nền tảng tổ chức và quản lý giải đấu cầu lông chuyên nghiệp hàng đầu Việt Nam. Kết nối đam mê, nâng tầm giải đấu.
            </p>
            <div className="flex gap-4 pt-2">
                <Link href="#" className="hover:text-yellow-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
                <Link href="#" className="hover:text-yellow-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
                <Link href="#" className="hover:text-yellow-500 transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
        </div>

        {/* Quick Links */}
        <div>
            <h4 className="font-bold text-white mb-4">Khám Phá</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/tournaments" className="hover:text-yellow-500 transition-colors">Tìm Giải Đấu</Link></li>
                <li><Link href="/tournaments/new" className="hover:text-yellow-500 transition-colors">Tạo Giải Đấu</Link></li>
                <li><Link href="/rankings" className="hover:text-yellow-500 transition-colors">Bảng Xếp Hạng</Link></li>
                <li><Link href="/news" className="hover:text-yellow-500 transition-colors">Tin Tức & Sự Kiện</Link></li>
            </ul>
        </div>

        {/* Support */}
        <div>
            <h4 className="font-bold text-white mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-yellow-500 transition-colors">Trung Tâm Trợ Giúp</Link></li>
                <li><Link href="/rules" className="hover:text-yellow-500 transition-colors">Điều Khoản Sử Dụng</Link></li>
                <li><Link href="/privacy" className="hover:text-yellow-500 transition-colors">Chính Sách Bảo Mật</Link></li>
                <li><Link href="/contact" className="hover:text-yellow-500 transition-colors">Liên Hệ</Link></li>
            </ul>
        </div>

        {/* Contact info shortcut */}
        <div>
            <h4 className="font-bold text-white mb-4">Liên Hệ Nhanh</h4>
            <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-yellow-500" />
                    support@cocup.vn
                </p>
                <p>Hotline: 1900 1234</p>
                <p>Địa chỉ: Tòa nhà TechHub, Quận 1, TP.HCM</p>
            </div>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>&copy; 2024 CoCup Platform. All rights reserved.</p>
      </div>
    </footer>
  )
}

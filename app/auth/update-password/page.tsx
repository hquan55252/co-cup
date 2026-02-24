import { UpdatePasswordForm } from "@/components/update-password-form"
import Image from "next/image"

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center">
         <div className="absolute inset-0 overflow-hidden">
            <Image 
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2005&auto=format&fit=crop"
                alt="Badminton Net"
                fill
                className="object-cover opacity-30"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-slate-950/40" />
         </div>
         <div className="relative z-10 text-center px-10 space-y-6">
            <div className="inline-block p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 mb-4">
              <span className="text-5xl">🔑</span>
            </div>
            <h1 className="text-5xl font-black text-white">Đặt lại mật khẩu</h1>
            <p className="text-xl text-slate-400 max-w-md">
                Tạo mật khẩu mới mạnh mẽ hơn để bảo vệ tài khoản của bạn.
            </p>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 bg-slate-950">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <UpdatePasswordForm />
        </div>
      </div>
    </div>
  )
}

import SignupForm from "@/components/auth/signup-form"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-indigo-900 items-center justify-center">
         <div className="absolute inset-0 overflow-hidden">
            <Image 
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop"
                alt="Badminton Racket"
                fill
                className="object-cover opacity-40 mix-blend-overlay"
                priority
            />
         </div>
         <div className="relative z-10 text-center px-10">
            <h1 className="text-5xl font-bold text-white mb-6">Tham gia cùng chúng tôi</h1>
            <p className="text-xl text-indigo-200">
                Tạo giải đấu, kết nối đam mê và chinh phục đỉnh cao.
            </p>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <SignupForm />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signupAction, signInWithGoogle } from '@/app/actions/auth'
import { SignupSchema } from '@/lib/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PasswordInput } from '@/components/ui/password-input'

type FormData = z.infer<typeof SignupSchema>

export default function SignupForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: FormData) {
    setIsPending(true)
    setError(null)
    setSuccess(false)

    try {
        const result = await signupAction(data)
        
        if (result?.error) {
            setError(result.error)
            return
        }

        if (result?.success) {
            setSuccess(true)
        }

    } catch (err) {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
        setIsPending(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      if (err?.digest?.includes('NEXT_REDIRECT')) {
        return
      }
      setError('Đã có lỗi xảy ra khi đăng nhập bằng Google.')
    }
  }

  if (success) {
      return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 bg-green-500/10 rounded-2xl border border-green-500/20">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-green-400">Đăng ký thành công!</h3>
              <p className="text-slate-400">
                  Vui lòng kiểm tra email của bạn để xác thực tài khoản.
              </p>
              <Button asChild className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold">
                  <Link href="/login">Quay lại Đăng nhập</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-white">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Tham gia cộng đồng cầu lông ngay hôm nay
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5 bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-2xl">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                    {error}
                </div>
            )}

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} disabled={isPending} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="vidu@email.com" {...field} disabled={isPending} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••" {...field} disabled={isPending} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••" {...field} disabled={isPending} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-500/20"
              disabled={isPending}
            >
              {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">
                  Hoặc
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white font-medium"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Đăng ký bằng Google
              </Button>
            </div>

            <div className="mt-6 text-center">
                <span className="text-slate-500 text-sm">Đã có tài khoản? </span>
                <Link href="/login" className="font-medium text-yellow-500 hover:text-yellow-400 text-sm">
                    Đăng nhập ngay
                </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

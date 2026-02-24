'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginAction, signInWithGoogle } from '@/app/actions/auth'
import { LoginSchema } from '@/lib/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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

type FormData = z.infer<typeof LoginSchema>

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(data: FormData) {
    setIsPending(true)
    setError(null)

    try {
        const result = await loginAction(data)
        
        if (result?.error) {
            setError(result.error)
            return
        }

        if (result?.success) {
            router.push('/') 
            router.refresh()
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

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-white">
          Chào mừng trở lại
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Đăng nhập để quản lý giải đấu của bạn
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-2xl">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                    {error}
                </div>
            )}
            
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

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      className="border-slate-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal text-slate-400 text-sm">
                      Ghi nhớ đăng nhập
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Link href="/auth/forgot-password" className="text-sm font-medium text-yellow-500 hover:text-yellow-400">
              Quên mật khẩu?
            </Link>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-500/20"
              disabled={isPending}
            >
              {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
              ) : (
                "Đăng nhập"
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
                Đăng nhập bằng Google
              </Button>
            </div>

            <div className="mt-6 text-center">
                <span className="text-slate-500 text-sm">Chưa có tài khoản? </span>
                <Link href="/auth/sign-up" className="font-medium text-yellow-500 hover:text-yellow-400 text-sm">
                    Đăng ký ngay
                </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

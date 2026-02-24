'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

type FormData = z.infer<typeof ForgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: FormData) {
    setIsPending(true)
    setError(null)
    setSuccess(false)

    try {
        const supabase = createClient()
        const origin = window.location.origin
        
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${origin}/auth/update-password`,
        })
        
        if (error) {
            setError(error.message)
            return
        }

        setSuccess(true)

    } catch (err) {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
        setIsPending(false)
    }
  }

  if (success) {
      return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 bg-green-500/10 rounded-2xl border border-green-500/20">
              <div className="p-3 bg-green-500/20 rounded-full text-green-400 mb-2">
                 <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-green-400">Đã gửi email khôi phục!</h3>
              <p className="text-slate-400">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến 
                  <span className="font-bold text-slate-300 block mt-1">{form.getValues('email')}</span>
              </p>
              <p className="text-sm text-slate-500">
                  Vui lòng kiểm tra hộp thư (cả mục spam/junk).
              </p>
              <Button asChild className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại Đăng nhập
                  </Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-white">
          Quên mật khẩu?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
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
                  <FormLabel className="text-slate-300">Email đã đăng ký</FormLabel>
                  <FormControl>
                    <Input placeholder="vidu@email.com" {...field} disabled={isPending} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
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
                    Đang gửi yêu cầu...
                  </>
              ) : (
                "Gửi Liên Kết Khôi Phục"
              )}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">
                  Hoặc
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
                <Link href="/login" className="flex items-center justify-center font-medium text-slate-400 hover:text-white transition-colors text-sm group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Quay lại Đăng nhập
                </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

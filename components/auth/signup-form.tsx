'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signupAction } from '@/app/actions/auth'
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

type FormData = z.infer<typeof SignupSchema>

export default function SignupForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
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

  if (success) {
      return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-green-700">Đăng ký thành công!</h3>
              <p className="text-gray-600">
                  Vui lòng kiểm tra email của bạn để xác thực tài khoản.
              </p>
              <Button asChild variant="outline" className="mt-4">
                  <Link href="/login">Quay lại Đăng nhập</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          tham gia cộng đồng cầu lông ngay hôm nay
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                </div>
            )}
            
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="vidu@email.com" {...field} disabled={isPending} />
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
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} disabled={isPending} />
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
                <FormLabel>Xác nhận Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
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
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Đã có tài khoản?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Đăng nhập ngay
                </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

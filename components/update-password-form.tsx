"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client"; // Updated import path to match others
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input"

const UpdatePasswordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof UpdatePasswordSchema>;

export function UpdatePasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsPending(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ 
        password: data.password 
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      // Optional: Redirect after a delay
      // setTimeout(() => router.push("/login"), 3000);

    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 bg-green-500/10 rounded-2xl border border-green-500/20">
        <div className="p-3 bg-green-500/20 rounded-full text-green-400 mb-2">
           <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-green-400">Đổi mật khẩu thành công!</h3>
        <p className="text-slate-400">
            Mật khẩu của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới để đăng nhập.
        </p>
        <Button asChild className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold">
            <Link href="/login">
              Đăng nhập ngay
            </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-white">
          Tạo mật khẩu mới
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Nhập mật khẩu mới của bạn bên dưới
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput 
                    placeholder="••••••" 
                    {...field} 
                    disabled={isPending} 
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" 
                  />
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
                <FormLabel className="text-slate-300">Nhập lại mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput 
                    placeholder="••••••" 
                    {...field} 
                    disabled={isPending} 
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20" 
                  />
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
                  Đang lưu...
                </>
              ) : (
                "Lưu mật khẩu mới"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

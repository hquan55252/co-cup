'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { LoginSchema, SignupSchema } from '@/lib/schemas/auth'

export type LoginState = {
  error?: string
  success?: boolean
}

export async function loginAction(data: z.infer<typeof LoginSchema>) {
  const supabase = await createClient()

  const { email, password } = data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email hoặc mật khẩu không chính xác.' }
  }

  return { success: true }
}

export async function signupAction(data: z.infer<typeof SignupSchema>) {
  const supabase = await createClient()
  const { email, password, fullName } = data

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}


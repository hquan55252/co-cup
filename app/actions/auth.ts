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

  // Determine redirect path
  // Ideally this should be dynamic based on where the user came from, 
  // but for now we default to dashboard or home.
  // We can't redirect INSIDE the try/catch block if we want to return state, 
  // but for a successful login, we usually WANT to redirect.
  // However, returning { success: true } allows the CLIENT to redirect, 
  // which is smoother for UI (can show a "Success" spinner before moving).
  
  return { success: true }
}

// Schema for Signup is imported from @/lib/schemas/auth

export async function signupAction(data: z.infer<typeof SignupSchema>) {
  const supabase = await createClient()
  const { email, password } = data

  // Get the URL for redirect
  // Use a fixed URL or env var for production
  // For Supabase Auth, we need to ensure the redirect URL is allowed in Supabase Dashboard
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { TournamentStatus, BracketType } from '@prisma/client'

// Define Schema matching the form
const TournamentSchema = z.object({
  name: z.string().min(3, "Tên giải ít nhất 3 ký tự"),
  description: z.string().optional(),
  rules: z.string().optional(),
  bannerUrl: z.string().optional(),
  location: z.string().optional(),
  contactInfo: z.string().optional(),
  startDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Ngày bắt đầu phải ở tương lai",
  }),
  deadline: z.string(), 
  minPlayers: z.coerce.number().min(2),
  maxPlayers: z.coerce.number().min(2),
  bracketType: z.nativeEnum(BracketType),
  status: z.nativeEnum(TournamentStatus).default(TournamentStatus.REGISTERING),
}).refine((data) => {
    return new Date(data.deadline) < new Date(data.startDate)
}, {
    message: "Hạn đăng ký phải trước ngày bắt đầu",
    path: ["deadline"]
}).refine((data) => {
    return data.maxPlayers >= data.minPlayers
}, {
    message: "Số lượng tối đa phải lớn hơn hoặc bằng tối thiểu",
    path: ["maxPlayers"]
})

export type CreateTournamentState = {
  errors?: {
    [key: string]: string[]
  }
  message?: string | null
}

export async function createTournament(prevState: CreateTournamentState, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      message: 'Bạn chưa đăng nhập.',
    }
  }

  // Parse fields
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    rules: formData.get('rules'),
    bannerUrl: formData.get('bannerUrl'),
    location: formData.get('location'),
    contactInfo: formData.get('contactInfo'),
    startDate: formData.get('startDate'),
    deadline: formData.get('deadline'),
    minPlayers: formData.get('minPlayers'),
    maxPlayers: formData.get('maxPlayers'),
    bracketType: formData.get('bracketType'),
    status: TournamentStatus.REGISTERING
  }

  const validatedFields = TournamentSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Lỗi nhập liệu. Vui lòng kiểm tra lại.',
    }
  }

  const { data } = validatedFields

  let tournamentId;

  try {
    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        description: data.description,
        rules: data.rules,
        bannerUrl: data.bannerUrl,
        location: data.location,
        contactInfo: data.contactInfo,
        startDate: new Date(data.startDate),
        deadline: new Date(data.deadline),
        minPlayers: data.minPlayers,
        maxPlayers: data.maxPlayers,
        bracketType: data.bracketType,
        status: data.status,
        creatorId: user.id
      }
    })
    tournamentId = tournament.id
  } catch (error) {
    console.error("DB Error:", error)
    return {
      message: 'Lỗi server. Không thể tạo giải đấu.',
    }
  }

  revalidatePath(`/tournaments/${tournamentId}`)
  redirect(`/tournaments/${tournamentId}`)
}

export async function registerForTournament(tournamentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: 'Bạn cần đăng nhập để đăng ký tham gia.',
    }
  }

  // Check tournament status and capacity
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { 
      _count: { 
        select: { registrations: true } 
      }
    }
  })

  if (!tournament) {
    return { success: false, message: 'Giải đấu không tồn tại.' }
  }

  if (tournament.status !== 'REGISTERING') {
    return { success: false, message: 'Giải đấu hiện không mở đăng ký.' }
  }

  if (tournament._count.registrations >= tournament.maxPlayers) {
    return { success: false, message: 'Giải đấu đã đủ số lượng đội tham gia.' }
  }

  // Check existing registration
  const existingRegistration = await prisma.registration.findUnique({
    where: {
      userId_tournamentId: {
        userId: user.id,
        tournamentId: tournamentId
      }
    }
  })

  if (existingRegistration) {
    return { success: false, message: 'Bạn đã đăng ký giải đấu này rồi.' }
  }

  try {
    await prisma.registration.create({
      data: {
        userId: user.id,
        tournamentId: tournamentId,
        status: 'pending' // Or 'approved' if auto-approve
      }
    })
  } catch (error) {
    console.error("Registration Error:", error)
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' }
  }

  revalidatePath(`/tournaments/${tournamentId}`)
  return { success: true, message: 'Đăng ký thành công!' }
}

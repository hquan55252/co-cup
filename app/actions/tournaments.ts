'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { TournamentStatus, BracketType } from '@prisma/client'

// Helper: parse datetime-local string safely (handles "2026-02-21T08:00" without seconds)
function parseDateSafe(dateStr: string): Date | null {
  if (!dateStr) return null
  // Normalize: append :00 if missing seconds
  const normalized = dateStr.length === 16 ? `${dateStr}:00` : dateStr
  const d = new Date(normalized)
  return isNaN(d.getTime()) ? null : d
}

// Define Schema matching the form
const TournamentSchema = z.object({
  name: z.string().min(3, "Tên giải ít nhất 3 ký tự"),
  description: z.string().nullish().transform(v => v ?? undefined),
  rules: z.string().nullish().transform(v => v ?? undefined),
  bannerUrl: z.string().nullish().transform(v => v ?? undefined),
  location: z.string().nullish().transform(v => v ?? undefined),
  contactInfo: z.string().nullish().transform(v => v ?? undefined),
  startDate: z.string()
    .min(1, "Ngày khai mạc là bắt buộc.")
    .refine((date) => {
      const selected = parseDateSafe(date)
      if (!selected) return false
      const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // now + 24h
      return selected > minDate
    }, {
      message: "Ngày khai mạc phải sau thời điểm hiện tại ít nhất 24 giờ.",
    }),
  deadline: z.string()
    .min(1, "Hạn đăng ký là bắt buộc.")
    .refine((date) => {
      const d = parseDateSafe(date)
      return d !== null && d > new Date()
    }, {
      message: "Hạn đăng ký phải là ngày trong tương lai.",
    }),
  minPlayers: z.coerce.number().min(2),
  maxPlayers: z.coerce.number().min(2),
  bracketType: z.nativeEnum(BracketType),
  status: z.nativeEnum(TournamentStatus).default(TournamentStatus.REGISTERING),
  skillLevel: z.string().optional(),
})
// Cross-field: deadline must be at least 24h before startDate
.refine((data) => {
  const start = parseDateSafe(data.startDate)
  const dead = parseDateSafe(data.deadline)
  if (!start || !dead) return false
  const buffer = 24 * 60 * 60 * 1000 // 24h in ms
  return dead.getTime() + buffer <= start.getTime()
}, {
  message: "Hạn đăng ký phải kết thúc trước ngày khai mạc ít nhất 24 giờ để ban tổ chức chuẩn bị.",
  path: ["deadline"],
})
// Cross-field: maxPlayers >= minPlayers
.refine((data) => {
  return data.maxPlayers >= data.minPlayers
}, {
  message: "Số lượng tối đa phải lớn hơn hoặc bằng tối thiểu",
  path: ["maxPlayers"],
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

  // Sync Profile on creation attempt
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url,
      role: 'user'
    },
    update: {
      email: user.email,
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url
    }
  })

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
    skillLevel: formData.get('skillLevel'),
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
        skillLevel: data.skillLevel,
        status: data.status,
        creatorId: profile.id // Use resolved profile.id
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

  // Sync Profile before registration to ensure foreign key constraint
  await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url,
      role: 'user'
    },
    update: {
      email: user.email,
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url
    }
  })

  // Check tournament status and capacity
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { 
      _count: { 
        select: { registrations: { where: { status: 'approved' } } } 
      }
    }
  })

  if (!tournament) {
    return { success: false, message: 'Giải đấu không tồn tại.' }
  }

  if (tournament.status !== 'REGISTERING') {
    return { success: false, message: 'Giải đấu hiện không mở đăng ký.' }
  }

  if (new Date(tournament.deadline) < new Date()) {
    return { success: false, message: 'Đã hết hạn đăng ký.' }
  }

  // MVP Race Condition Check: Approved participants only
  if (tournament._count.registrations >= tournament.maxPlayers) {
    return { success: false, message: 'Giải đấu đã đủ số lượng đội tham gia.' }
  }

  // Check existing registration
  const existingRegistration = await prisma.registration.findFirst({
    where: {
      userId: user.id,
      tournamentId: tournamentId
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
        status: 'pending' 
      }
    })
  } catch (error) {
    console.error("Registration Error:", error)
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' }
  }

  revalidatePath(`/tournaments/${tournamentId}`)
  return { success: true, message: 'Đăng ký thành công! Vui lòng chờ BTC duyệt.' }
}

export async function manageRegistration(registrationId: string, action: 'approved' | 'rejected') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Resolve Profile to check ownership
  const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
  })
  
  if (!profile) {
      throw new Error("Unauthorized")
  }

  // 1. Get registration & tournament info to verify ownership
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { tournament: true }
  })

  if (!registration) {
    return { success: false, message: 'Không tìm thấy đơn đăng ký.' }
  }

  // 2. SECURITY CHECK: Only Creator can manage (check profile.id)
  if (registration.tournament.creatorId !== profile.id) {
    throw new Error("Unauthorized: Bạn không phải chủ giải.")
  }

  // 3. If approving, check max players again
  if (action === 'approved') {
    const approvedCount = await prisma.registration.count({
      where: {
        tournamentId: registration.tournamentId,
        status: 'approved'
      }
    })

    if (approvedCount >= registration.tournament.maxPlayers) {
       return { success: false, message: 'Giải đấu đã đủ người. Không thể duyệt thêm.' }
    }
  }

  try {
    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: action }
    })
  } catch (error) {
     console.error("Manage Registration Error:", error)
     return { success: false, message: 'Lỗi khi cập nhật trạng thái.' }
  }

  revalidatePath(`/tournaments/${registration.tournamentId}`)
  return { success: true, message: `Đã ${action === 'approved' ? 'duyệt' : 'từ chối'} vận động viên.` }
}

export async function getHostedTournaments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  try {
    // Resolve profile first to be safe
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) return []

    const tournaments = await prisma.tournament.findMany({
      where: { creatorId: profile.id }, // Use resolved profile.id
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return tournaments
  } catch (error) {
    console.error("Get Hosted Tournaments Error:", error)
    return []
  }
}

export async function getJoinedTournaments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: user.id },
      include: {
        tournament: {
            include: {
                creator: true
            }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return registrations
  } catch (error) {
    console.error("Get Joined Tournaments Error:", error)
    return []
  }
}


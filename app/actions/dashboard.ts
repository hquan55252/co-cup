'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  try {
    // 1. Get Profile (Sync with Auth Data)
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

    if (!profile) return null

    // 2. Parallel Fetching
    const [hostedCount, joinedCount, recentHosted] = await Promise.all([
      // Count Hosted
      prisma.tournament.count({
        where: { creatorId: profile.id }
      }),
      // Count Joined
      prisma.registration.count({
        where: { userId: user.id } // Registration links to userId
      }),
      // Recent Hosted (Limit 3)
      prisma.tournament.findMany({
        where: { creatorId: profile.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
           _count: { select: { registrations: true } }
        }
      })
    ])

    return {
      user,
      profile,
      hostedCount,
      joinedCount,
      recentHosted
    }

  } catch (error) {
    console.error("Dashboard Stats Error:", error)
    return null
  }
}

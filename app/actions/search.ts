'use server'

import { prisma } from '@/lib/prisma'

export async function searchTournaments(query: string) {
  if (!query || query.length < 2) return []

  try {
    const results = await prisma.tournament.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        name: true,
        bannerUrl: true,
        startDate: true,
        status: true,
        location: true
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    return results
  } catch (error) {
    console.error("Search Error:", error)
    return []
  }
}

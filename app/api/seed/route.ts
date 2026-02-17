import { createClient } from '@/utils/supabase/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const supabase = await createClient()

  // 1. Get current user (to assign as creator)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please login to seed data.' }, { status: 401 })
  } 

  try {
    // 2. Clear existing test data (Optional)
    // await prisma.match.deleteMany({})
    // await prisma.registration.deleteMany({})

    // 3. Create Fake Athletes (Profiles) FIRST to satisfy Foreign Key
    const dummyAthletes = [
      { id: 'user_01', fullName: 'Nguyễn Tiến Minh', avatarUrl: 'https://placehold.co/100?text=TM' },
      { id: 'user_02', fullName: 'Kento Momota', avatarUrl: 'https://placehold.co/100?text=KM' },
      { id: 'user_03', fullName: 'Viktor Axelsen', avatarUrl: 'https://placehold.co/100?text=VA' },
      { id: 'user_04', fullName: 'Jonatan Christie', avatarUrl: 'https://placehold.co/100?text=JC' },
    ]

    for (const athlete of dummyAthletes) {
        // We use upsert to ensure they exist
        await prisma.profile.upsert({
            where: { userId: athlete.id },
            update: {},
            create: {
                id: athlete.id, 
                userId: athlete.id,
                fullName: athlete.fullName,
                avatarUrl: athlete.avatarUrl,
                role: 'user'
            }
        })
    }

    // 4. Create Tournaments
    const tournament1 = await prisma.tournament.create({
      data: {
        name: 'Giải Cầu Lông Mở Rộng TP.HCM 2024',
        description: 'Giải đấu quy tụ các tay vợt hàng đầu khu vực phía Nam. Tổng giải thưởng lên đến 50 triệu đồng.',
        rules: 'Luật thi đấu BWF hiện hành. Đấu loại trực tiếp.',
        bannerUrl: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=2000&auto=format&fit=crop',
        location: 'Nhà thi đấu Phú Thọ',
        startDate: new Date('2024-06-15'),
        deadline: new Date('2024-06-01'),
        status: 'REGISTERING',
        bracketType: 'MANUAL',
        minPlayers: 4,
        maxPlayers: 32,
        creatorId: user.id,
      },
    })
    
    await prisma.tournament.create({
      data: {
        name: 'Hanoi Open Badminton Championship',
        description: 'Sân chơi chuyên nghiệp dành cho các VĐV bán chuyên tại Hà Nội.',
        rules: 'Luật thi đấu BWF.',
        // Fixed: Use a reliable image
        bannerUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop',
        location: 'Cầu Giấy Arena',
        startDate: new Date('2024-07-20'),
        deadline: new Date('2024-07-10'),
        status: 'PENDING_CONFIRMATION',
        bracketType: 'MANUAL',
        minPlayers: 8,
        maxPlayers: 16,
        creatorId: user.id,
      },
    })

    await prisma.tournament.create({
      data: {
        name: 'Đà Nẵng Badminton Cup 2024',
        description: 'Giải đấu mùa hè sôi động tại thành phố biển Đà Nẵng.',
        rules: 'Luật thi đấu BWF.',
        bannerUrl: 'https://images.unsplash.com/photo-1611252187687-0b19280d853e?q=80&w=2000&auto=format&fit=crop',
        location: 'Trung tâm TDTT Sơn Trà',
        startDate: new Date('2024-08-05'),
        deadline: new Date('2024-07-25'),
        status: 'CONFIRMED',
        bracketType: 'MANUAL',
        minPlayers: 8,
        maxPlayers: 24,
        creatorId: user.id,
      },
    })

    console.log('Created Tournament:', tournament1.id)
    
    // 5. Register Athletes to Tournament (Tournament 1)
    for (const athlete of dummyAthletes) {
        await prisma.registration.upsert({
            where: {
                userId_tournamentId: {
                    userId: athlete.id,
                    tournamentId: tournament1.id
                }
            },
            update: {},
            create: {
                userId: athlete.id,
                tournamentId: tournament1.id,
                status: 'approved'
            }
        })
    }

    // 6. Create Semifinal Matches (Manual Bracket)
    await prisma.match.create({
        data: {
            tournamentId: tournament1.id,
            round: 1, // Semi-final
            player1Id: dummyAthletes[0].id,
            player2Id: dummyAthletes[1].id,
            scoreP1: 0,
            scoreP2: 0,
        }
    })

    await prisma.match.create({
        data: {
            tournamentId: tournament1.id,
            round: 1, // Semi-final
            player1Id: dummyAthletes[2].id,
            player2Id: dummyAthletes[3].id,
            scoreP1: 0,
            scoreP2: 0,
        }
    })

    return NextResponse.json({ success: true, tournamentId: tournament1.id })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json({ error: 'Failed to seed data', details: String(error) }, { status: 500 })
  }
}

'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Trophy, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center bg-slate-900">
      {/* Background Container with Overflow Hidden */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image with overlay */}
        <div 
            className="absolute inset-0 z-0 opacity-40 grayscale"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1626224583764-847890e05399?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

         {/* Decorative Elements */}
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -z-1" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] -z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-4 space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <Badge variant="outline" className="border-lime-500/50 text-lime-400 py-1.5 px-4 rounded-full bg-lime-500/10 backdrop-blur-sm mb-4">
            🏆 Nền Tảng Cầu Lông Đỉnh Cao
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
          Nâng Tầm Đam Mê. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-lime-400">Chinh Phục Sân Đấu.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tổ chức giải đấu, cập nhật tỉ số trực tiếp và chia sẻ khoảnh khắc với nền tảng chuyên nghiệp dành cho nhà vô địch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-14 text-base shadow-lg shadow-indigo-600/20 transition-all hover:scale-105">
                <Trophy className="mr-2 h-5 w-5" /> Tìm Giải Đấu
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-slate-600 text-slate-200 hover:bg-white/10 hover:text-white h-14 text-base backdrop-blur-sm bg-black/20">
                <Users className="mr-2 h-5 w-5" /> Tạo Giải Đấu
            </Button>
        </div>
      </div>

      {/* Ticker - Now outside the overflow-hidden container but inside the relative parent */}

    </div>
  )
}



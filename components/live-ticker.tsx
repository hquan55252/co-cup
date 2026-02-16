'use client'

import { Badge } from "@/components/ui/badge"

export function LiveTicker() {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-black/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/10 w-fit mx-auto">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-red-500 uppercase">TRỰC TIẾP</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-3 font-mono text-sm">
            <span className="font-semibold text-gray-300">Momota</span>
            <span className="bg-lime-500 text-black px-1.5 py-0.5 rounded text-xs font-bold">21</span>
            <span className="text-gray-500">-</span>
            <span className="text-white font-bold">19</span>
            <span className="font-semibold text-gray-300">Axelsen</span>
        </div>
      </div>
    </div>
  )
}

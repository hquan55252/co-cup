'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export function TournamentFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('q')?.toString() || "")

  // Sync state with URL params (in case changed by NavbarSearch)
  useEffect(() => {
    const q = searchParams.get('q')?.toString() || ""
    if (q !== searchValue) {
      setSearchValue(q)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Only trigger on URL change

  // Custom debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || ""
      // If local state matches URL, do nothing (prevents loop)
      if (currentQ === searchValue) return

      const params = new URLSearchParams(searchParams)
      if (searchValue) {
        params.set('q', searchValue)
      } else {
        params.delete('q')
      }
      router.replace(`/tournaments?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, router, searchParams])

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'ALL') {
      params.set('status', value)
    } else {
      params.delete('status')
    }
    router.replace(`/tournaments?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Tìm kiếm giải đấu..." 
          className="pl-11 h-12 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:bg-white/5 rounded-xl transition-colors"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
      <Select 
        defaultValue={searchParams.get('status')?.toString() || "ALL"} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full md:w-[200px] h-12 bg-transparent border-0 text-white focus:ring-0 focus:bg-white/5 rounded-xl transition-colors">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-800 text-white">
          <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
          <SelectItem value="REGISTERING">Đang Mở Đăng Ký</SelectItem>
          <SelectItem value="ON_GOING">Đang Diễn Ra</SelectItem>
          <SelectItem value="COMPLETED">Đã Kết Thúc</SelectItem>
          <SelectItem value="PENDING_CONFIRMATION">Chờ Duyệt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

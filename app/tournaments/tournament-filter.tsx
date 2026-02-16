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
  
  // Custom debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
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
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Tìm kiếm giải đấu..." 
          className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-yellow-500"
          defaultValue={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Select 
        defaultValue={searchParams.get('status')?.toString() || "ALL"} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full md:w-[200px] bg-slate-900 border-slate-800 text-white focus:ring-yellow-500">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-800 text-white">
          <SelectItem value="ALL">Tất cả</SelectItem>
          <SelectItem value="REGISTERING">Đang Mở Đăng Ký</SelectItem>
          <SelectItem value="ON_GOING">Đang Diễn Ra</SelectItem>
          <SelectItem value="COMPLETED">Đã Kết Thúc</SelectItem>
          <SelectItem value="PENDING_CONFIRMATION">Chờ Duyệt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

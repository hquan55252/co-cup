"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Calendar, MapPin, Trophy, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { searchTournaments } from "@/app/actions/search"
import { Badge } from "@/components/ui/badge"

export function NavbarSearch({ className }: { className?: string }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery) {
        setResults([])
        return
      }
      
      setLoading(true)
      const data = await searchTournaments(debouncedQuery)
      setResults(data)
      setLoading(false)
    }

    fetchResults()
  }, [debouncedQuery])

  const handleSelect = (id: string) => {
    setOpen(false)
    router.push(`/tournaments/${id}`)
  }

  return (
    <>
      <Button
        variant="ghost"
        className={cn("w-10 h-10 p-0 rounded-full text-slate-400 hover:text-white hover:bg-slate-800", className)}
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl h-[85vh] gap-0 p-0 outline-none bg-slate-950/95 backdrop-blur-3xl border-slate-800 shadow-2xl overflow-hidden sm:rounded-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <DialogTitle className="sr-only">Tìm kiếm giải đấu</DialogTitle>
            <Command className="bg-transparent w-full h-full flex flex-col" shouldFilter={false}>
                {/* Search Header */}
                <div className="flex items-center border-b border-yellow-500/20 px-6 py-6 bg-gradient-to-r from-slate-900/50 to-slate-900/0 relative z-10">
                    <Search className="mr-4 h-8 w-8 shrink-0 text-yellow-500" />
                    <CommandPrimitive.Input 
                        autoFocus
                        placeholder="Tìm kiếm giải đấu, địa điểm..." 
                        className="flex-1 h-14 text-2xl md:text-3xl font-light bg-transparent border-0 ring-0 focus:ring-0 placeholder:text-slate-600 text-white p-0 w-full focus:outline-none"
                        value={query}
                        onValueChange={setQuery}
                    />
                    
                    {query && (
                        <Button
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 shrink-0 text-slate-500 hover:text-white hover:bg-white/10 rounded-full mr-2"
                            onClick={() => {
                                setQuery("")
                                // Optionally refocus input if lost, but usually input stays mounted
                            }}
                        >
                            <X className="h-6 w-6" />
                            <span className="sr-only">Xóa tìm kiếm</span>
                        </Button>
                    )}

                    {loading && <Loader2 className="h-6 w-6 animate-spin text-yellow-500 ml-2" />}
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10" />
                </div>
                
                {/* Results Area */}
                <CommandList className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-full">
                    <CommandEmpty className="h-full flex flex-col items-center justify-center -mt-12">
                        {query ? (
                             <div className="flex flex-col items-center gap-4 text-slate-500 animate-in fade-in zoom-in duration-300">
                                <Search className="h-16 w-16 opacity-20" />
                                <p className="text-lg font-medium">Không tìm thấy kết quả cho &quot;{query}&quot;</p>
                             </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 text-slate-600 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-6 rounded-full bg-slate-900/50 ring-1 ring-white/5">
                                    <Trophy className="h-16 w-16 opacity-30 text-yellow-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-medium text-slate-300">Tìm kiếm giải đấu</p>
                                    <p className="text-sm">Nhập tên giải đấu, môn thi đấu hoặc địa điểm</p>
                                </div>
                            </div>
                        )}
                    </CommandEmpty>

                    {results.length > 0 && (
                        <CommandGroup heading="KẾT QUẢ TÌM KIẾM" className="text-yellow-500 text-xs font-bold tracking-widest mb-4 ">
                        <div className="flex flex-col gap-3 mt-4 pb-12">
                            {results.map((item) => (
                                <CommandItem
                                key={item.id}
                                value={item.name}
                                onSelect={() => handleSelect(item.id)}
                                className="flex flex-row gap-4 p-3 h-auto items-stretch rounded-xl cursor-pointer bg-slate-900 border border-slate-800 hover:border-yellow-500/50 aria-selected:border-yellow-500/50 aria-selected:bg-slate-800 transition-all group overflow-hidden shadow-sm data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                                >
                                    {/* Cover Image - Left Side */}
                                    <div className="relative w-40 h-28 shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-white/5">
                                        {item.bannerUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                src={item.bannerUrl} 
                                                alt={item.name}
                                                className="h-full w-full object-cover group-hover:scale-105 group-aria-selected:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-800/50">
                                                <Trophy className="h-8 w-8 text-slate-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content - Right Side */}
                                    <div className="flex flex-col justify-between py-1 min-w-0 flex-1 h-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="font-bold text-base md:text-lg text-slate-200 group-hover:text-yellow-500 group-aria-selected:text-yellow-500 line-clamp-2 leading-tight transition-colors">
                                                {item.name}
                                            </span>
                                            <Badge variant="secondary" className="shrink-0 bg-slate-950/80 hover:bg-slate-950/90 text-[10px] px-2 py-0.5 border-white/10 text-white shadow-sm whitespace-nowrap">
                                                {item.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5 text-xs text-slate-500 group-aria-selected:text-slate-400">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                                                <span className="truncate">{new Date(item.startDate).toLocaleDateString("vi-VN", { dateStyle: 'long' })}</span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                                                <span className="truncate">{item.location || "Chưa cập nhật địa điểm"}</span>
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </div>
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

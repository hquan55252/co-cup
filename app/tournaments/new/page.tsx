'use client'

import { useActionState, useState } from 'react'
import { createTournament, CreateTournamentState } from '@/app/actions/tournaments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/image-upload'
import { Loader2, CalendarIcon, MapPin, Trophy, Users, Info, Settings, LayoutDashboard, Calendar, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'

// Premium DateTimePicker with Calendar popover and disabled past dates
function DateTimeInput({
    label,
    name,
    required,
    error,
    onChange,
    disabledBefore,
}: {
    label: string
    name: string
    required?: boolean
    error?: string
    onChange?: (val: string) => void
    /** Disable all dates before this date (exclusive) */
    disabledBefore?: Date
}) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>()
    const [time, setTime] = useState('08:00')

    const isoValue = date ? `${format(date, 'yyyy-MM-dd')}T${time}` : ''

    const handleDateSelect = (d: Date | undefined) => {
        setDate(d)
        setOpen(false)
        if (d && onChange) onChange(`${format(d, 'yyyy-MM-dd')}T${time}`)
    }

    const handleTimeChange = (t: string) => {
        setTime(t)
        if (date && onChange) onChange(`${format(date, 'yyyy-MM-dd')}T${t}`)
    }

    // Disable: before disabledBefore (or today if not set)
    const disabledDays = disabledBefore
        ? { before: disabledBefore }
        : { before: new Date() }

    return (
        <div className="space-y-2">
            <Label className="text-slate-200 font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            {/* Date + Time row */}
            <div className="flex gap-2">
                {/* Calendar Popover */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className={cn(
                                'flex-1 justify-start text-left font-normal',
                                'bg-slate-950 border-slate-700 hover:bg-slate-800 hover:border-slate-600',
                                'text-white hover:text-white transition-colors h-10',
                                !date && 'text-slate-500 hover:text-slate-400'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-yellow-500 shrink-0" />
                            {date
                                ? format(date, 'dd/MM/yyyy', { locale: vi })
                                : <span>Chọn ngày</span>
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 bg-slate-900 border-slate-700 shadow-2xl shadow-black/50"
                        align="start"
                    >
                        {/* Calendar header accent */}
                        <div className="px-4 pt-3 pb-1 border-b border-slate-800">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                {label}
                            </p>
                        </div>
                        <CalendarPicker
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            disabled={disabledDays}
                            initialFocus
                            locale={vi}
                            className="text-white"
                        />
                        {/* Time input inside popover */}
                        <div className="px-4 pb-4 pt-2 border-t border-slate-800">
                            <Label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                                Giờ
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-yellow-500 pointer-events-none" />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    className="w-full h-9 rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Time display badge */}
                {date && (
                    <div className="flex items-center gap-1.5 px-3 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 shrink-0">
                        <Clock className="h-3.5 w-3.5 text-yellow-500" />
                        <span>{time}</span>
                    </div>
                )}
            </div>

            {/* Selected date display */}
            {date && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(date, "EEEE, dd 'tháng' MM, yyyy", { locale: vi })} lúc {time}
                </p>
            )}

            <input type="hidden" name={name} value={isoValue} />
            {error && <p className="text-red-400 text-sm flex items-center gap-1">⚠ {error}</p>}
        </div>
    )
}


export default function CreateTournamentPage() {
  const initialState: CreateTournamentState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(createTournament, initialState)
  
  // Local state for live preview
  const [bannerUrl, setBannerUrl] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [bracketType, setBracketType] = useState('MANUAL')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                TẠO <span className="text-yellow-500">GIẢI ĐẤU MỚI</span>
            </h1>
            <p className="text-slate-400 text-lg">Thiết lập thông tin để bắt đầu hành trình tìm kiếm nhà vô địch.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-8 space-y-8">
                <form action={formAction} className="space-y-8">
                    
                    {/* Section 1: General Info */}
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Info className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Thông Tin Cơ Bản</CardTitle>
                                    <CardDescription className="text-slate-400">Hình ảnh và thông tin chung về giải đấu</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-base text-slate-200">Ảnh Bìa Giải Đấu (Banner)</Label>
                                <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl p-4 hover:border-yellow-500/50 transition-colors">
                                    <ImageUpload 
                                        onUploadComplete={(url) => setBannerUrl(url)} 
                                        onRemove={() => setBannerUrl('')}
                                    />
                                </div>
                                <input type="hidden" name="bannerUrl" value={bannerUrl} />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-200">Tên giải đấu <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        placeholder="Ví dụ: Giải Cầu Lông Hồ Tây Open 2026" 
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-yellow-500 h-12 text-lg"
                                        required 
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-slate-200">Mô tả giới thiệu</Label>
                                    <Textarea 
                                        id="description" 
                                        name="description" 
                                        placeholder="Mô tả ngắn gọn về giải đấu, đối tượng tham gia, mục đích tổ chức..." 
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-yellow-500 min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rules" className="text-slate-200 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-yellow-500" />
                                        Quy định giải đấu
                                    </Label>
                                    <Textarea 
                                        id="rules" 
                                        name="rules" 
                                        placeholder={"Mỗi dòng là một quy định. Ví dụ:\n- VĐV phải có mặt trước 15 phút\n- Trang phục thi đấu bắt buộc\n- Không được sử dụng vợt carbon quá 85g"}
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-yellow-500 min-h-[120px] font-mono text-sm"
                                    />
                                    <p className="text-xs text-slate-500">Mỗi dòng là một quy định. Sẽ hiển thị dạng danh sách trên trang giải đấu.</p>
                                </div>

                                <div className="space-y-2">
                                     <Label className="text-slate-200">Trình độ chuyên môn</Label>
                                     <Select name="skillLevel" defaultValue="Trung bình">
                                        <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-11">
                                            <SelectValue placeholder="Chọn trình độ" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                            <SelectItem value="Yếu" className="focus:bg-slate-800 focus:text-white">Yếu</SelectItem>
                                            <SelectItem value="Trung bình yếu" className="focus:bg-slate-800 focus:text-white">Trung bình yếu</SelectItem>
                                            <SelectItem value="Trung bình" className="focus:bg-slate-800 focus:text-white">Trung bình</SelectItem>
                                            <SelectItem value="Trung bình khá" className="focus:bg-slate-800 focus:text-white">Trung bình khá</SelectItem>
                                            <SelectItem value="Khá" className="focus:bg-slate-800 focus:text-white">Khá</SelectItem>
                                            <SelectItem value="Bán chuyên" className="focus:bg-slate-800 focus:text-white">Bán chuyên</SelectItem>
                                        </SelectContent>
                                     </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: Time & Location */}
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                         <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Thời Gian & Địa Điểm</CardTitle>
                                    <CardDescription className="text-slate-400">Lịch trình thi đấu và nơi tổ chức</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DateTimeInput 
                                    label="Ngày khai mạc" 
                                    name="startDate" 
                                    required 
                                    error={state.errors?.startDate?.join(', ')}
                                    onChange={setStartDate}
                                />
                                
                                <DateTimeInput 
                                    label="Hạn đăng ký" 
                                    name="deadline" 
                                    required 
                                    error={state.errors?.deadline?.join(', ')}
                                />
                             </div>

                             <div className="space-y-2">
                                <Label htmlFor="location" className="text-slate-200">Địa điểm thi đấu</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input 
                                        id="location" 
                                        name="location" 
                                        placeholder="Ví dụ: Nhà thi đấu Quận Cầu Giấy..." 
                                        className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500"
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 3: Format & Settings */}
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Settings className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Thể Thức & Cấu Hình</CardTitle>
                                    <CardDescription className="text-slate-400">Quy định về số lượng VĐV và cách chia bảng</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="minPlayers" className="text-slate-200">VĐV Tối thiểu</Label>
                                    <Input 
                                        id="minPlayers" 
                                        name="minPlayers" 
                                        type="number" 
                                        defaultValue={4} 
                                        min={2} 
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxPlayers" className="text-slate-200">VĐV Tối đa</Label>
                                    <Input 
                                        id="maxPlayers" 
                                        name="maxPlayers" 
                                        type="number" 
                                        defaultValue={64} 
                                        min={2} 
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-purple-500"
                                    />
                                     {state.errors?.maxPlayers && <p className="text-red-500 text-sm">{state.errors.maxPlayers}</p>}
                                </div>
                            </div>

                             <div className="space-y-2">
                                 <Label className="text-slate-200">Hình thức chia bảng (Bracket)</Label>
                                 <Select name="bracketType" defaultValue="MANUAL" onValueChange={setBracketType}>
                                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-11">
                                        <SelectValue placeholder="Chọn kiểu chia bảng" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                        <SelectItem value="MANUAL" className="focus:bg-slate-800 focus:text-white">Thủ công (Upload ảnh/Excel)</SelectItem>
                                        <SelectItem value="AI_AUTO" className="focus:bg-slate-800 focus:text-white">AI Tự động chia (Ngẫu nhiên)</SelectItem>
                                        <SelectItem value="AI_PROMPT" className="focus:bg-slate-800 focus:text-white">AI theo yêu cầu (Prompt)</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <div className="text-sm text-slate-500 mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800">

                                    {bracketType === 'MANUAL' && 'Bạn sẽ tự quản lý và cập nhật kết quả thi đấu thủ công.'}
                                    {bracketType === 'AI_AUTO' && 'Hệ thống sẽ tự động tạo sơ đồ thi đấu ngẫu nhiên dựa trên danh sách đăng ký.'}
                                    {bracketType === 'AI_PROMPT' && 'Sử dụng AI để tạo sơ đồ thi đấu phức tạp theo yêu cầu đặc biệt của bạn.'}
                                 </div>
                            </div>
                        </CardContent>
                    </Card>

                    {state.message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 font-semibold">
                                <Info className="h-5 w-5 shrink-0" />
                                {state.message}
                            </div>
                            {state.errors && Object.entries(state.errors).length > 0 && (
                                <ul className="ml-7 space-y-1 text-sm list-disc">
                                    {Object.entries(state.errors).map(([field, msgs]) =>
                                        msgs?.map((msg, i) => (
                                            <li key={`${field}-${i}`}>
                                                <span className="font-medium capitalize">{field}</span>: {msg}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button type="submit" className="w-full h-14 text-lg bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold rounded-xl shadow-lg shadow-yellow-500/10" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang Khởi Tạo...
                                </>
                            ) : (
                                'Xác Nhận Tạo Giải'
                            )}
                        </Button>
                        <p className="text-center text-slate-500 text-sm mt-4">
                            Bằng việc tạo giải đấu, bạn đồng ý với các quy định của ban tổ chức.
                        </p>
                    </div>
                </form>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4 text-yellow-500" />
                            Xem Trước
                        </h3>
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 text-xs">Live Preview</Badge>
                    </div>

                    {/* Preview Card */}
                    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-yellow-500/30">
                        {/* Banner Preview */}
                        <div className="relative h-48 bg-slate-950 w-full overflow-hidden">
                            {bannerUrl ? (
                                <Image 
                                    src={bannerUrl} 
                                    alt="Preview Banner" 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-600">
                                    <div className="text-center">
                                        <Trophy className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                        <span className="text-sm">Chưa có ảnh bìa</span>
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400">ĐĂNG KÝ</Badge>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <h4 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2">
                                    {name || 'Tên Giải Đấu Của Bạn'}
                                </h4>
                                <div className="flex items-center text-slate-400 text-sm gap-2">
                                    <MapPin className="h-3 w-3" />
                                    <span className="line-clamp-1">{location || 'Địa điểm tổ chức'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-slate-800 w-full" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Khởi Tranh</span>
                                    <div className="text-sm font-medium text-white flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                        {startDate ? new Date(startDate).toLocaleDateString('vi-VN') : '--/--/----'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Thể Thức</span>
                                    <div className="text-sm font-medium text-white flex items-center gap-1.5">
                                        <Icons.bracket className="h-3.5 w-3.5 text-purple-500" />
                                        {bracketType === 'MANUAL' ? 'Thủ Công' : 'AI Tự Động'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Mẹo Hay
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Ảnh bìa chất lượng cao và tên giải đấu hấp dẫn sẽ thu hút nhiều vận động viên đăng ký tham gia hơn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

// Helper icons
const Icons = {
    bracket: (props: any) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8"/><path d="M8 8v8h8V8"/><rect x="8" y="3" width="8" height="5" rx="1"/></svg>
    )
}

'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X, ImagePlus } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  onRemove?: () => void
  defaultValue?: string
  className?: string
  bucket?: string
}

export default function ImageUpload({ 
  onUploadComplete, 
  onRemove, 
  defaultValue = '', 
  className = '',
  bucket = 'tournament-media'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(defaultValue)
  const supabase = createClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setImageUrl(data.publicUrl)
      onUploadComplete(data.publicUrl)

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Lỗi upload ảnh')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setImageUrl('')
    if (onRemove) onRemove()
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {imageUrl ? (
        <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-sm">
           <Image 
             src={imageUrl} 
             alt="Uploaded image" 
             fill 
             className="object-cover"
           />
           <Button
             type="button"
             variant="destructive"
             size="icon"
             className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
             onClick={handleRemove}
           >
             <X className="h-4 w-4" />
           </Button>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-900 hover:border-yellow-500/50 transition-all cursor-pointer relative group">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="animate-spin h-8 w-8 text-yellow-500" />
                <span className="text-sm font-medium">Đang tải lên...</span>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-3 text-slate-500 group-hover:text-yellow-500 transition-colors">
                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-yellow-500/10 transition-colors">
                    <ImagePlus className="h-6 w-6" />
                </div>
                <div className="text-center">
                    <span className="text-sm font-medium block">Bấm để chọn ảnh bìa</span>
                    <span className="text-xs text-slate-600 mt-1 block">PNG, JPG, GIF (Max 5MB)</span>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  )
}

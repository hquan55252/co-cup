'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Button } from "@/components/ui/button" // Assuming you have a button component
import { Input } from "@/components/ui/input"
import { saveMedia } from '@/app/gallery/actions'
import { Loader2 } from 'lucide-react'

export default function MediaUpload({ tournamentId }: { tournamentId: string }) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Bạn chưa chọn ảnh để upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tournament-media')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Save to DB
      await saveMedia(tournamentId, filePath, 'image')
      alert('Upload thành công!')

    } catch (error) {
      alert('Lỗi upload ảnh')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg max-w-sm">
      <h3 className="text-lg font-semibold">Đăng Khoảnh Khắc</h3>
      <div className="flex gap-2 items-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        {uploading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
      </div>
    </div>
  )
}

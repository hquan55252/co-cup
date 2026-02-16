import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'

export default async function GalleryGrid({ tournamentId }: { tournamentId: string }) {
  const supabase = await createClient()

  const { data: mediaItems } = await supabase
    .from('media')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('created_at', { ascending: false })

  if (!mediaItems || mediaItems.length === 0) {
    return <div className="text-center p-8 text-gray-500">Chưa có khoảnh khắc nào được chia sẻ.</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {mediaItems.map((item) => {
        // Construct public URL
        const { data } = supabase.storage.from('tournament-media').getPublicUrl(item.bucket_path)
        
        return (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
                <Image
                src={data.publicUrl}
                alt="Tournament Moment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        )
      })}
    </div>
  )
}

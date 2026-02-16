'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveMedia(tournamentId: string, bucketPath: string, type: string = 'image') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('media')
    .insert({
      tournament_id: tournamentId,
      bucket_path: bucketPath,
      type,
    })

  if (error) {
    console.error('Error saving media:', error)
    throw new Error('Failed to save media')
  }

  revalidatePath(`/tournaments/${tournamentId}`)
  return { success: true }
}

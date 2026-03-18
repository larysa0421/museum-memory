import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── 博物馆相关 ───────────────────────────────────────────────

export async function getMuseums() {
  const { data, error } = await supabase
    .from('museums')
    .select('*')
    .order('city')
  if (error) throw error
  return data
}

export async function getMuseumById(id) {
  const { data, error } = await supabase
    .from('museums')
    .select(`
      *,
      memories (
        *,
        photos (*)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createMuseum(museum) {
  const { data, error } = await supabase
    .from('museums')
    .insert(museum)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMuseum(id, updates) {
  const { data, error } = await supabase
    .from('museums')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMuseum(id) {
  const { error } = await supabase.from('museums').delete().eq('id', id)
  if (error) throw error
}

// ─── 记忆相关 ─────────────────────────────────────────────────

export async function getMemory(museumId) {
  const { data, error } = await supabase
    .from('memories')
    .select(`*, photos (*)`)
    .eq('museum_id', museumId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertMemory(memory) {
  const { data, error } = await supabase
    .from('memories')
    .upsert(memory, { onConflict: 'museum_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── 照片相关 ─────────────────────────────────────────────────

export async function uploadPhoto(file, memoryId) {
  const ext = file.name.split('.').pop()
  const path = `${memoryId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(path)

  const { data, error } = await supabase
    .from('photos')
    .insert({ memory_id: memoryId, url: publicUrl, storage_path: path })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePhoto(photoId, storagePath) {
  await supabase.storage.from('photos').remove([storagePath])
  const { error } = await supabase.from('photos').delete().eq('id', photoId)
  if (error) throw error
}

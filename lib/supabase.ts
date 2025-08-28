import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Asset {
  id: string
  user_id: string
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  file_type: string
  file_size: number
  tags: string[]
  ai_tags: string[]
  collection_id?: string
  created_at: string
  updated_at: string
  metadata?: any
}

export interface Collection {
  id: string
  user_id: string
  name: string
  description?: string
  color?: string
  is_public: boolean
  created_at: string
  updated_at: string
  asset_count: number
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  storage_used: number
  storage_limit: number
  created_at: string
  updated_at: string
}

export interface Collaboration {
  id: string
  collection_id: string
  user_id: string
  role: 'viewer' | 'editor' | 'admin'
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

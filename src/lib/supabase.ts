import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface User {
  id: string
  email: string
  username: string
  nickname: string
  status: string
  avatar_url?: string
  online_status: 'online' | 'idle' | 'offline' | 'stealth'
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  name?: string
  type: 'dm' | 'group'
  avatar_url?: string
  description?: string
  is_private: boolean
  created_by: string
  created_at: string
  updated_at: string
  last_message_at?: string
  auto_delete_days: 7 | 1 // 7 days or 24 hours (1 day)
}

export interface Message {
  id: string
  chat_id: string
  user_id: string
  content: string
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'gif'
  reply_to?: string
  edited_at?: string
  created_at: string
  reactions?: { emoji: string; user_ids: string[] }[]
  media_url?: string
  media_type?: string
}

export interface ChatMember {
  chat_id: string
  user_id: string
  role: 'admin' | 'mod' | 'member'
  joined_at: string
  nickname?: string
  muted: boolean
}

export interface Story {
  id: string
  user_id: string
  media_url: string
  media_type: 'image' | 'video' | 'gif'
  created_at: string
  expires_at: string
  viewers: string[]
}

export interface Friendship {
  id: string
  user1_id: string
  user2_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
  updated_at: string
}
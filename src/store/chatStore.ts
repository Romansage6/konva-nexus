// src/store/chatStore.ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase-client'

type Message = {
  id: string
  content: string
  created_at: string
  sender_id: string
  chat_id: string
}

type ChatStore = {
  messages: Message[]
  loadMessages: (chatId: string) => Promise<void>
  subscribeToMessages: (chatId: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  loadMessages: async (chatId) => {
    // 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading messages:', error)
      return
    }

    set({ messages: data || [] })
  },

  subscribeToMessages: (chatId) => {
    supabase
      .channel(`messages:chat_id=eq.${chatId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          set((state) => ({
            messages: [...state.messages, payload.new as Message],
          }))
        }
      )
      .subscribe()
  },
}))
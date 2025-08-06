import { create } from 'zustand'
import { supabase } from '@/lib/supabase-client'
import type { Chat, Message, ChatMember } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface ChatState {
  chats: Chat[]
  messages: Message[]
  currentChat: Chat | null
  loading: boolean
  loadChats: () => Promise<void>
  loadMessages: (chatId: string) => Promise<void>
  sendMessage: (chatId: string, content: string, type?: string) => Promise<void>
  createDM: (userId: string) => Promise<string>
  createGroupChat: (name: string, memberIds: string[]) => Promise<string>
  setCurrentChat: (chat: Chat | null) => void
  subscribeToMessages: (chatId: string) => () => void
  subscribeToChats: () => () => void
  deleteMessage: (messageId: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  addReaction: (messageId: string, emoji: string, userId: string) => Promise<void>
  removeReaction: (messageId: string, emoji: string, userId: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  currentChat: null,
  loading: false,

  loadChats: async () => {
    set({ loading: true })
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.data.session?.user) return

      const { data: chats, error } = await supabase
        .from('chats')
        .select(`
          *,
          chat_members!inner(user_id)
        `)
        .eq('chat_members.user_id', session.data.session.user.id)
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (error) throw error

      set({ chats: chats || [] })
    } catch (error: any) {
      toast({
        title: "Failed to load chats",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      set({ loading: false })
    }
  },

  loadMessages: async (chatId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          users(username, nickname, avatar_url)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error

      set({ messages: messages || [] })
    } catch (error: any) {
      toast({
        title: "Failed to load messages",
        description: error.message,
        variant: "destructive"
      })
    }
  },

  sendMessage: async (chatId: string, content: string, type: string = 'text') => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.data.session?.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          user_id: session.data.session.user.id,
          content,
          type
        })

      if (error) throw error

      // Update last_message_at in chat
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId)

    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      })
    }
  },

  createDM: async (userId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.data.session?.user) throw new Error('Not authenticated')

      // Check if DM already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select(`
          id,
          chat_members!inner(user_id)
        `)
        .eq('type', 'dm')
        .eq('chat_members.user_id', session.data.session.user.id)

      const dmWithUser = existingChat?.find((chat: any) => 
        chat.chat_members.some((member: any) => member.user_id === userId) &&
        chat.chat_members.length === 2
      )

      if (dmWithUser) {
        return dmWithUser.id
      }

      // Create new DM
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          type: 'dm',
          is_private: false,
          created_by: session.data.session.user.id
        })
        .select()
        .single()

      if (error) throw error

      // Add members
      const memberInserts = [
        { chat_id: newChat.id, user_id: session.data.session.user.id, role: 'admin' },
        { chat_id: newChat.id, user_id: userId, role: 'member' }
      ]

      await supabase
        .from('chat_members')
        .insert(memberInserts)

      return newChat.id
    } catch (error: any) {
      toast({
        title: "Failed to create DM",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  },

  createGroupChat: async (name: string, memberIds: string[]) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.data.session?.user) throw new Error('Not authenticated')

      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          name,
          type: 'group',
          is_private: false,
          created_by: session.data.session.user.id
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as admin
      const memberInserts = [
        { chat_id: newChat.id, user_id: session.data.session.user.id, role: 'admin' },
        ...memberIds.map(userId => ({
          chat_id: newChat.id,
          user_id: userId,
          role: 'member' as const
        }))
      ]

      await supabase
        .from('chat_members')
        .insert(memberInserts)

      return newChat.id
    } catch (error: any) {
      toast({
        title: "Failed to create group chat",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  },

  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat })
    if (chat) {
      get().loadMessages(chat.id)
    }
  },

  subscribeToMessages: (chatId: string) => {
    const subscription = supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload: any) => {
          const { messages } = get()
          set({ messages: [...messages, payload.new] })
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload: any) => {
          const { messages } = get()
          set({ 
            messages: messages.map(msg => 
              msg.id === payload.new.id ? payload.new : msg
            )
          })
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload: any) => {
          const { messages } = get()
          set({ 
            messages: messages.filter(msg => msg.id !== payload.old.id)
          })
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },

  subscribeToChats: () => {
    const subscription = supabase
      .channel('chats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chats' },
        () => {
          get().loadChats()
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },

  deleteMessage: async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive"
      })
    }
  },

  editMessage: async (messageId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          content, 
          edited_at: new Date().toISOString() 
        })
        .eq('id', messageId)

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Failed to edit message",
        description: error.message,
        variant: "destructive"
      })
    }
  },

  addReaction: async (messageId: string, emoji: string, userId: string) => {
    try {
      const { data: message } = await supabase
        .from('messages')
        .select('reactions')
        .eq('id', messageId)
        .single()

      const reactions = message?.reactions || []
      const existingReaction = reactions.find((r: any) => r.emoji === emoji)

      let newReactions
      if (existingReaction) {
        if (!existingReaction.user_ids.includes(userId)) {
          existingReaction.user_ids.push(userId)
        }
        newReactions = reactions
      } else {
        newReactions = [...reactions, { emoji, user_ids: [userId] }]
      }

      const { error } = await supabase
        .from('messages')
        .update({ reactions: newReactions })
        .eq('id', messageId)

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Failed to add reaction",
        description: error.message,
        variant: "destructive"
      })
    }
  },

  removeReaction: async (messageId: string, emoji: string, userId: string) => {
    try {
      const { data: message } = await supabase
        .from('messages')
        .select('reactions')
        .eq('id', messageId)
        .single()

      const reactions = message?.reactions || []
      const newReactions = reactions
        .map((r: any) => ({
          ...r,
          user_ids: r.user_ids.filter((id: string) => id !== userId)
        }))
        .filter((r: any) => r.user_ids.length > 0)

      const { error } = await supabase
        .from('messages')
        .update({ reactions: newReactions })
        .eq('id', messageId)

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Failed to remove reaction",
        description: error.message,
        variant: "destructive"
      })
    }
  }
}))
import { create } from 'zustand'
import { supabase } from '@/integrations/supabase/client'
import type { Chat, Message, ChatMember } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface ChatState {
  chats: Chat[]
  messages: Record<string, Message[]>
  currentChat: Chat | null
  loading: boolean
  sendingMessage: boolean
  
  // Actions
  loadChats: () => Promise<void>
  loadMessages: (chatId: string) => Promise<void>
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'video' | 'file' | 'voice' | 'gif') => Promise<void>
  createDM: (userId: string) => Promise<Chat>
  createGroupChat: (name: string, description?: string, userIds?: string[]) => Promise<Chat>
  setCurrentChat: (chat: Chat | null) => void
  subscribeToMessages: (chatId: string) => void
  subscribeToChats: () => void
  deleteMessage: (messageId: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  addReaction: (messageId: string, emoji: string) => Promise<void>
  removeReaction: (messageId: string, emoji: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  currentChat: null,
  loading: false,
  sendingMessage: false,

  loadChats: async () => {
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's chats through chat_members
      const { data: memberData, error } = await supabase
        .from('chat_members')
        .select(`
          chat_id,
          user_id,
          chats!inner (
            id,
            name,
            type,
            avatar_url,
            description,
            is_private,
            created_by,
            created_at,
            updated_at,
            last_message_at,
            auto_delete_days
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const chats = memberData?.map(m => (m as any).chats).filter(Boolean) || []
      set({ chats })
    } catch (error: any) {
      console.error('Error loading chats:', error)
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
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          chat_id,
          user_id,
          content,
          type,
          reply_to,
          edited_at,
          created_at,
          reactions,
          media_url,
          media_type,
          users (
            id,
            username,
            nickname,
            avatar_url
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error

      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: data || []
        }
      }))
    } catch (error: any) {
      console.error('Error loading messages:', error)
      toast({
        title: "Failed to load messages",
        description: error.message,
        variant: "destructive"
      })
    }
  },

  sendMessage: async (chatId: string, content: string, type = 'text') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    set({ sendingMessage: true })
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          user_id: user.id,
          content,
          type
        })
        .select()
        .single()

      if (error) throw error

      // Update chat's last_message_at
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId)

    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      set({ sendingMessage: false })
    }
  },

  createDM: async (userId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    try {
      // Check if DM already exists
      const { data: existingChat } = await supabase
        .from('chat_members')
        .select(`
          chat_id,
          chats!inner (
            id,
            type,
            name,
            avatar_url,
            description,
            is_private,
            created_by,
            created_at,
            updated_at,
            last_message_at,
            auto_delete_days
          )
        `)
        .eq('chats.type', 'dm')
        .in('user_id', [user.id, userId])

      // Find chat that has both users
      const dmChat = existingChat?.find(chat => {
        const chatMembers = existingChat.filter(c => c.chat_id === chat.chat_id)
        return chatMembers.length === 2 && 
               chatMembers.some(c => (c as any).user_id === user.id) &&
               chatMembers.some(c => (c as any).user_id === userId)
      })

      if (dmChat) {
        return dmChat.chats
      }

      // Create new DM
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          type: 'dm',
          is_private: true,
          created_by: user.id
        })
        .select()
        .single()

      if (chatError) throw chatError

      // Add both users as members
      const { error: membersError } = await supabase
        .from('chat_members')
        .insert([
          { chat_id: newChat.id, user_id: user.id, role: 'admin' },
          { chat_id: newChat.id, user_id: userId, role: 'member' }
        ])

      if (membersError) throw membersError

      return newChat
    } catch (error: any) {
      console.error('Error creating DM:', error)
      toast({
        title: "Failed to create DM",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  },

  createGroupChat: async (name: string, description?: string, userIds: string[] = []) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    try {
      // Create group chat
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          name,
          description,
          type: 'group',
          is_private: false,
          created_by: user.id
        })
        .select()
        .single()

      if (chatError) throw chatError

      // Add creator as admin
      const members = [
        { chat_id: newChat.id, user_id: user.id, role: 'admin' as const },
        ...userIds.map(userId => ({
          chat_id: newChat.id,
          user_id: userId,
          role: 'member' as const
        }))
      ]

      const { error: membersError } = await supabase
        .from('chat_members')
        .insert(members)

      if (membersError) throw membersError

      toast({
        title: "Group created!",
        description: `${name} has been created successfully.`
      })

      return newChat
    } catch (error: any) {
      console.error('Error creating group chat:', error)
      toast({
        title: "Failed to create group",
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const { messages } = get()
          const chatMessages = messages[chatId] || []
          
          if (payload.eventType === 'INSERT') {
            set(state => ({
              messages: {
                ...state.messages,
                [chatId]: [...chatMessages, payload.new as Message]
              }
            }))
          } else if (payload.eventType === 'UPDATE') {
            set(state => ({
              messages: {
                ...state.messages,
                [chatId]: chatMessages.map(msg => 
                  msg.id === payload.new.id ? payload.new as Message : msg
                )
              }
            }))
          } else if (payload.eventType === 'DELETE') {
            set(state => ({
              messages: {
                ...state.messages,
                [chatId]: chatMessages.filter(msg => msg.id !== payload.old.id)
              }
            }))
          }
        }
      )
      .subscribe()

    return subscription
  },

  subscribeToChats: () => {
    const subscription = supabase
      .channel('chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        () => {
          get().loadChats()
        }
      )
      .subscribe()

    return subscription
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

  addReaction: async (messageId: string, emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Get current message
      const { data: message } = await supabase
        .from('messages')
        .select('reactions')
        .eq('id', messageId)
        .single()

      if (!message) return

      const reactions = message.reactions || []
      const existingReaction = reactions.find((r: any) => r.emoji === emoji)

      let updatedReactions
      if (existingReaction) {
        // Add user to existing reaction
        updatedReactions = reactions.map((r: any) => 
          r.emoji === emoji 
            ? { ...r, user_ids: [...new Set([...r.user_ids, user.id])] }
            : r
        )
      } else {
        // Create new reaction
        updatedReactions = [...reactions, { emoji, user_ids: [user.id] }]
      }

      const { error } = await supabase
        .from('messages')
        .update({ reactions: updatedReactions })
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

  removeReaction: async (messageId: string, emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Get current message
      const { data: message } = await supabase
        .from('messages')
        .select('reactions')
        .eq('id', messageId)
        .single()

      if (!message) return

      const reactions = message.reactions || []
      const updatedReactions = reactions
        .map((r: any) => ({
          ...r,
          user_ids: r.user_ids.filter((id: string) => id !== user.id)
        }))
        .filter((r: any) => r.user_ids.length > 0)

      const { error } = await supabase
        .from('messages')
        .update({ reactions: updatedReactions })
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
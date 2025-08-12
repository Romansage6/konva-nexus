// store/chatStore.ts
import create from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';

type Reaction = { emoji: string; user_ids: string[] };
type Message = {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
  edited_at?: string | null;
  reply_to?: string | null;
  reply_to_content?: string | null;
  reactions?: Reaction[];
  users?: { id: string; nickname?: string; avatar_url?: string };
};

type Chat = { id: string; name?: string; avatar_url?: string; type?: string; auto_delete_days?: number };

type ChatState = {
  currentChat: Chat | null;
  messages: Message[];
  sendingMessage: boolean;
  unreadMap: Record<string, number>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, replyTo?: Message | null) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  subscribeToChat: (chatId: string) => void;
  unsubscribe: () => void;
  setCurrentChat: (chat: Chat | null) => void;
};

export const useChatStore = create<ChatState>((set, get) => {
  let channel: any = null;

  const MESSAGE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  return {
    currentChat: null,
    messages: [],
    sendingMessage: false,
    unreadMap: {},

    setCurrentChat: (chat) => set({ currentChat: chat }),

    loadMessages: async (chatId) => {
      const since = new Date(Date.now() - MESSAGE_RETENTION_MS).toISOString();
      const { data, error } = await supabase
        .from('messages')
        .select('*, users:profiles(id,nickname,avatar_url)')
        .eq('chat_id', chatId)
        .gte('created_at', since)
        .order('created_at', { ascending: true })
        .limit(500);

      if (error) {
        console.error('loadMessages', error);
        return;
      }

      // normalize users alias to message.users for UI compatibility
      const normalized = (data || []).map((m: any) => ({ ...m }));
      set({ messages: normalized });
    },

    sendMessage: async (chatId, content, replyTo) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Not authenticated');
      set({ sendingMessage: true });
      const payload: any = {
        chat_id: chatId,
        user_id: user.id,
        content,
      };
      if (replyTo) {
        payload.reply_to = replyTo.id;
        payload.reply_to_content = replyTo.content;
      }
      const { data, error } = await supabase.from('messages').insert(payload).select('*').single();
      set({ sendingMessage: false });
      if (error) {
        console.error('sendMessage', error);
        throw error;
      }
      // realtime will push the message; optimistic UI could be added
      return data;
    },

    editMessage: async (messageId, content) => {
      const { data, error } = await supabase
        .from('messages')
        .update({ content, edited_at: new Date().toISOString() })
        .eq('id', messageId)
        .select('*')
        .single();
      if (error) console.error('editMessage', error);
      return data;
    },

    deleteMessage: async (messageId) => {
      const { error } = await supabase.from('messages').delete().eq('id', messageId);
      if (error) console.error('deleteMessage', error);
    },

    addReaction: async (messageId, emoji) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Not authenticated');

      const { data: msg } = await supabase.from('messages').select('reactions').eq('id', messageId).single();
      let reactions = msg?.reactions || [];

      const idx = reactions.findIndex((r: any) => r.emoji === emoji);
      if (idx === -1) {
        reactions.push({ emoji, user_ids: [user.id] });
      } else {
        const userIds: string[] = reactions[idx].user_ids || [];
        if (!userIds.includes(user.id)) userIds.push(user.id);
        reactions[idx].user_ids = userIds;
      }

      const { error } = await supabase.from('messages').update({ reactions }).eq('id', messageId);
      if (error) console.error('addReaction', error);
    },

    removeReaction: async (messageId, emoji) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Not authenticated');

      const { data: msg } = await supabase.from('messages').select('reactions').eq('id', messageId).single();
      let reactions = msg?.reactions || [];
      const idx = reactions.findIndex((r: any) => r.emoji === emoji);
      if (idx === -1) return;

      reactions[idx].user_ids = reactions[idx].user_ids.filter((id: string) => id !== user.id);
      if (reactions[idx].user_ids.length === 0) {
        reactions.splice(idx, 1);
      }

      const { error } = await supabase.from('messages').update({ reactions }).eq('id', messageId);
      if (error) console.error('removeReaction', error);
    },

    subscribeToChat: (chatId) => {
      if (channel) {
        try { channel.unsubscribe(); } catch (e) {}
        channel = null;
      }

      const since = new Date(Date.now() - MESSAGE_RETENTION_MS).toISOString();

      channel = supabase
        .channel(`public:messages:chat=${chatId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
          (payload: any) => {
            const e = payload;
            if (e.eventType === 'INSERT') {
              // attach user profile
              supabase
                .from('profiles')
                .select('id,nickname,avatar_url')
                .eq('id', e.new.user_id)
                .single()
                .then(({ data: profile }) => {
                  set((s) => {
                    // ignore if older than retention
                    if (new Date(e.new.created_at) < new Date(since)) return s;
                    return { messages: [...s.messages, { ...e.new, users: profile }] };
                  });
                });
            } else if (e.eventType === 'UPDATE') {
              set((s) => ({ messages: s.messages.map((m) => (m.id === e.new.id ? { ...m, ...e.new } : m)) }));
            } else if (e.eventType === 'DELETE') {
              set((s) => ({ messages: s.messages.filter((m) => m.id !== e.old.id) }));
            }
          }
        )
        .subscribe();
    },

    unsubscribe: () => {
      if (channel) {
        try { channel.unsubscribe(); } catch (e) {}
        channel = null;
      }
    },
  };
});
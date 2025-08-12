// store/authStore.ts
import create from 'zustand';
import { supabase } from '@/lib/supabaseClient';

type Profile = {
  id: string;
  nickname?: string;
  avatar_url?: string;
  last_seen?: string | null;
};

type AuthState = {
  user: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

export const initAuthListener = () => {
  // initial load
  supabase.auth.getUser().then(async ({ data }) => {
    const u = data.user;
    if (u) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id,nickname,avatar_url,last_seen')
        .eq('id', u.id)
        .single();
      useAuthStore.setState({ user: profile || { id: u.id }, loading: false });
    } else {
      useAuthStore.setState({ user: null, loading: false });
    }
  });

  // realtime auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    const u = session?.user;
    if (u) {
      supabase
        .from('profiles')
        .select('id,nickname,avatar_url,last_seen')
        .eq('id', u.id)
        .single()
        .then(({ data: profile }) => {
          useAuthStore.setState({ user: profile || { id: u.id }, loading: false });
        });
    } else {
      useAuthStore.setState({ user: null, loading: false });
    }
  });
};
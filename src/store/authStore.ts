import { create } from 'zustand'
import { supabase } from '@/lib/supabase-client'
import type { User } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, nickname: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (profile) {
          set({ user: profile, initialized: true })
        } else {
          // Create profile if it doesn't exist
          const defaultProfile = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.email?.split('@')[0] || 'user',
            nickname: session.user.email?.split('@')[0] || 'user',
            status: "New to konva! 👋",
            online_status: 'online' as const,
            avatar_url: null,
            bio: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const { error: insertError } = await supabase
            .from('users')
            .insert(defaultProfile)
          
          if (!insertError) {
            set({ user: defaultProfile, initialized: true })
          } else {
            console.error('Failed to create profile:', insertError)
            set({ user: null, initialized: true })
          }
        }
      } else {
        set({ user: null, initialized: true })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          
          if (profile) {
            set({ user: profile })
          } else {
            // Create profile if it doesn't exist
            const defaultProfile = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.email?.split('@')[0] || 'user',
              nickname: session.user.email?.split('@')[0] || 'user',
              status: "New to konva! 👋",
              online_status: 'online' as const,
              avatar_url: null,
              bio: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            const { error: insertError } = await supabase
              .from('users')
              .insert(defaultProfile)
            
            if (!insertError) {
              set({ user: defaultProfile })
            }
          }
        } else if (event === 'SIGNED_OUT') {
          set({ user: null })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ user: null, initialized: true })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in."
      })
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive"
      })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email: string, password: string, username: string, nickname: string) => {
    set({ loading: true })
    try {
      // Check if username is unique
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single()
      
      if (existingUser) {
        throw new Error('Username already taken')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            username,
            nickname,
            status: "New to konva! 👋",
            online_status: 'online'
          })
        
        if (profileError) throw profileError
      }
      
      toast({
        title: "Account created!",
        description: "Welcome to konva! Please check your email to verify your account."
      })
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive"
      })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "An error occurred during Google sign in",
        variant: "destructive"
      })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Signed out",
        description: "You've been signed out successfully."
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive"
      })
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get()
    if (!user) throw new Error('No user logged in')
    
    set({ loading: true })
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
      
      if (error) throw error
      
      set({ user: { ...user, ...updates } })
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
      throw error
    } finally {
      set({ loading: false })
    }
  }
}))
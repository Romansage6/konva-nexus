import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { useChatStore } from "@/store/chatStore"
import AuthPage from "@/components/auth/AuthPage"
import ChatLayout from "@/components/ChatLayout"

export default function MainApp() {
  const { user, loading, initialized, initialize } = useAuthStore()
  const { loadChats, subscribeToChats } = useChatStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      loadChats()
      subscribeToChats()
    }
  }, [user, loadChats, subscribeToChats])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-chat flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading konva...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <ChatLayout />
}
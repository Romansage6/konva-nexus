// src/components/chat/ChatInterface.tsx
import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'

type Props = {
  chatId: string
}

export default function ChatInterface({ chatId }: Props) {
  const { messages, loadMessages, subscribeToMessages } = useChatStore()

  useEffect(() => {
    if (!chatId) return

    loadMessages(chatId)
    subscribeToMessages(chatId)

    // Optional: cleanup subscriptions when chat changes
    return () => {
      supabase.removeAllChannels()
    }
  }, [chatId])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="text-sm text-gray-500">{msg.sender_id}</span>
            <p className="bg-gray-100 p-2 rounded">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
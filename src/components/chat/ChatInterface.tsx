import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/store/chatStore"
import { useAuthStore } from "@/store/authStore"
import { Send, Smile, Paperclip, MoreVertical, Reply, Edit2, Trash2, Heart, ThumbsUp, Laugh } from "lucide-react"
import { format } from "date-fns"
import EmojiPicker from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageItemProps {
  message: any
  isOwn: boolean
  onReply: (message: any) => void
  onEdit: (message: any) => void
  onDelete: (messageId: string) => void
  onReaction: (messageId: string, emoji: string) => void
}

function MessageItem({ message, isOwn, onReply, onEdit, onDelete, onReaction }: MessageItemProps) {
  const [showReactions, setShowReactions] = useState(false)
  
  const quickReactions = ['❤️', '👍', '😂', '😮', '😢', '😡']

  return (
    <div className={`flex gap-3 p-3 hover:bg-muted/30 group ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.users?.avatar_url} />
          <AvatarFallback className="text-xs bg-gradient-primary text-white">
            {message.users?.nickname?.slice(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{message.users?.nickname}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
          </div>
        )}
        
        <div className={`relative rounded-lg px-3 py-2 ${
          isOwn 
            ? 'bg-chat-bubble-sent text-chat-bubble-sent-foreground' 
            : 'bg-chat-bubble-received text-chat-bubble-received-foreground'
        }`}>
          {message.reply_to && (
            <div className="text-xs opacity-70 mb-1 p-2 bg-background/20 rounded">
              Replying to: {message.reply_to_content}
            </div>
          )}
          
          <p className="text-sm">{message.content}</p>
          
          {message.edited_at && (
            <span className="text-xs opacity-60 ml-2">(edited)</span>
          )}
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {message.reactions.map((reaction: any, index: number) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-accent"
                  onClick={() => onReaction(message.id, reaction.emoji)}
                >
                  {reaction.emoji} {reaction.user_ids?.length || 0}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {isOwn && (
          <span className="text-xs text-muted-foreground mt-1">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        )}
        
        {/* Message actions */}
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 mt-1 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => setShowReactions(!showReactions)}
          >
            <Smile className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => onReply(message)}
          >
            <Reply className="h-3 w-3" />
          </Button>
          
          {isOwn && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => onEdit(message)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => onDelete(message.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
        
        {showReactions && (
          <div className="flex gap-1 mt-1">
            {quickReactions.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  onReaction(message.id, emoji)
                  setShowReactions(false)
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const [message, setMessage] = useState("")
  const [replyTo, setReplyTo] = useState<any>(null)
  const [editingMessage, setEditingMessage] = useState<any>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const { 
    currentChat, 
    messages, 
    sendMessage, 
    sendingMessage,
    deleteMessage,
    editMessage,
    addReaction,
    removeReaction
  } = useChatStore()
  
  const { user } = useAuthStore()
  
  const currentMessages = messages

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [currentMessages])

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat || sendingMessage) return
    
    try {
      if (editingMessage) {
        await editMessage(editingMessage.id, message)
        setEditingMessage(null)
      } else {
        await sendMessage(currentChat.id, message)
      }
      
      setMessage("")
      setReplyTo(null)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return
    
    // Check if user already reacted with this emoji
    const msg = currentMessages.find(m => m.id === messageId)
    const reaction = msg?.reactions?.find((r: any) => r.emoji === emoji)
    const hasReacted = reaction?.user_ids?.includes(user.id)
    
    if (hasReacted) {
      await removeReaction(messageId, emoji)
    } else {
      await addReaction(messageId, emoji)
    }
  }

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>
          <h2 className="text-2xl font-bold gradient-text">Select a chat to start messaging</h2>
          <p className="text-muted-foreground">Choose a conversation from the sidebar to begin chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-chat">
      {/* Chat Header */}
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentChat.avatar_url} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {currentChat.name?.slice(0, 2).toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{currentChat.name || 'Chat'}</h3>
            <p className="text-sm text-muted-foreground">
              {currentChat.type === 'group' ? 'Group chat' : 'Direct message'}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Info</DropdownMenuItem>
            <DropdownMenuItem>Mute Chat</DropdownMenuItem>
            {currentChat.type === 'group' && (
              <DropdownMenuItem>Leave Group</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-1">
          {currentMessages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isOwn={msg.user_id === user?.id}
              onReply={setReplyTo}
              onEdit={setEditingMessage}
              onDelete={deleteMessage}
              onReaction={handleReaction}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        {replyTo && (
          <div className="mb-2 p-2 bg-muted rounded-lg text-sm">
            <span className="text-muted-foreground">Replying to:</span> {replyTo.content}
            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>×</Button>
          </div>
        )}
        
        {editingMessage && (
          <div className="mb-2 p-2 bg-accent/20 rounded-lg text-sm">
            <span className="text-accent-foreground">Editing message</span>
            <Button variant="ghost" size="sm" onClick={() => setEditingMessage(null)}>×</Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
            />
            
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setMessage(prev => prev + emojiData.emoji)
                    setShowEmojiPicker(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || sendingMessage}
            className="glow-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Messages older than {currentChat.auto_delete_days === 1 ? '24 hours' : '7 days'} will be automatically removed to protect your privacy
        </div>
      </div>
    </div>
  )
}
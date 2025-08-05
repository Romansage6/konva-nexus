import { useState } from "react"
import { Send, Bot, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function AIInterface() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. Ask me anything or check out the trending topics below!",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)

  const trendingTopics = [
    "Latest tech trends 2024",
    "Best programming languages to learn",
    "Climate change solutions",
    "Space exploration updates",
    "AI in healthcare",
    "Cryptocurrency market analysis"
  ]

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${message}". This is a mock AI response. In a real implementation, this would connect to an AI service like OpenAI, Claude, or similar.`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  const handleTopicClick = (topic: string) => {
    setMessage(topic)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">AI Interface</h1>
            <p className="text-muted-foreground">Ask questions and explore trending topics</p>
          </div>
          <Bot className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-4 ${
                    msg.isUser 
                      ? 'bg-chat-bubble-sent text-chat-bubble-sent-foreground ml-12' 
                      : 'bg-chat-bubble-received text-chat-bubble-received-foreground mr-12'
                  }`}>
                    {!msg.isUser && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-chat-bubble-received text-chat-bubble-received-foreground rounded-lg p-4 mr-12">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 bg-card border-t border-border">
            <div className="flex items-center gap-2 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2 max-w-3xl mx-auto">
              AI responses are simulated. In production, this would connect to a real AI service.
            </p>
          </div>
        </div>

        {/* Trending Topics Sidebar */}
        <div className="w-80 bg-card border-l border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Trending Topics</h3>
          </div>
          
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleTopicClick(topic)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{topic}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Quick Commands</h4>
            <div className="space-y-2">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent w-full justify-start"
                onClick={() => handleTopicClick("What's the weather today?")}
              >
                Weather
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent w-full justify-start"
                onClick={() => handleTopicClick("Tell me a joke")}
              >
                Jokes
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent w-full justify-start"
                onClick={() => handleTopicClick("Latest news")}
              >
                News
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent w-full justify-start"
                onClick={() => handleTopicClick("Explain quantum computing")}
              >
                Science
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
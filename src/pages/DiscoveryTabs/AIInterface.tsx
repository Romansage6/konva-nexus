import { useState } from "react";
import { Send, Bot, TrendingUp, Lightbulb, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AIInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm konva AI. Ask me anything or explore trending topics below.",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const trendingTopics = [
    "What's happening in tech today?",
    "Latest anime releases",
    "Best manga to read this month",
    "How to improve productivity?",
    "Explain quantum computing",
    "Creative writing tips"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: "I understand your question. This is a demo response - AI integration will be added later!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">konva AI</h1>
        </div>
        
        {/* Trending Topics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Trending Topics</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {trendingTopics.map((topic, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setMessage(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            {!msg.isUser && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-white text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <Card className={`max-w-[70%] ${msg.isUser ? 'bg-primary text-primary-foreground' : ''}`}>
              <CardContent className="p-3">
                <p className="text-sm">{msg.content}</p>
                <span className={`text-xs opacity-70 ${msg.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </CardContent>
            </Card>
            
            {msg.isUser && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-white text-xs">
                  YOU
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-border">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ask konva AI anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Lightbulb className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Try asking about trending topics, tech news, or get creative assistance!
          </span>
        </div>
      </div>
    </div>
  );
}
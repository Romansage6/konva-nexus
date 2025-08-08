import { useState, useEffect } from "react";
import { MessageCircle, Compass, User, Search, UserPlus, Users, Bell, Archive, MoreVertical, Lock, Clock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import ChatInterface from "@/components/chat/ChatInterface";
import Discovery from "@/pages/Discovery";
import Profile from "@/pages/Profile";

type Tab = "chat" | "discovery" | "you";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasViewed: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  isOnline?: boolean;
  status?: "online" | "idle" | "offline" | "stealth";
}

export default function ChatLayout() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const { chats, setCurrentChat, currentChat } = useChatStore();
  const { user } = useAuthStore();
  
  // Ensure user is redirected to chat tab on initial load
  useEffect(() => {
    setActiveTab("chat");
  }, []);
  
  // Mock stories data - will be replaced with real data from Supabase
  const stories: Story[] = [];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-status-online";
      case "idle": return "bg-status-idle"; 
      case "stealth": return "bg-status-stealth";
      default: return "bg-status-offline";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <div className="flex-1 flex flex-col h-full">
            {/* Title Bar */}
            <div className="h-14 flex items-center justify-between px-4 bg-card border-b border-border">
              <h1 className="text-xl font-bold gradient-text">konva</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Archive className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Lock className="mr-2 h-4 w-4" />
                      Locked Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="mr-2 h-4 w-4" />
                      Disappearing Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HardDrive className="mr-2 h-4 w-4" />
                      Media Save Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-card border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10 bg-muted border-0"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Stories Sidebar */}
              {stories.length > 0 && (
                <div className="w-20 bg-card border-r border-border p-2 space-y-3">
                  {stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center">
                      <div className={`p-0.5 rounded-full ${story.hasViewed ? 'bg-story-viewed' : 'story-ring'}`}>
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarFallback className="text-xs bg-gradient-primary text-white">
                            {story.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 truncate w-full text-center">
                        {story.username}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Chat List and Interface */}
              <div className="flex-1 flex">
                {/* Chat List */}
                <div className="w-80 bg-card border-r border-border overflow-y-auto">
                  <div className="p-2 text-xs text-muted-foreground bg-muted/50 border-b border-border text-center">
                    Messages older than 7 days will be automatically removed to protect your privacy
                  </div>
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setCurrentChat(chat)}
                      className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors ${
                        currentChat?.id === chat.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.avatar_url} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {(chat.name || 'Chat').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {chat.type === 'dm' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-status-online" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{chat.name || 'Chat'}</h3>
                            {chat.type === 'group' && (
                              <Users className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {chat.last_message_at ? new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.type === 'group' ? `Group chat • ${chat.description || 'No description'}` : 'Direct message'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Interface */}
                <ChatInterface />
              </div>
            </div>
          </div>
        );
      
      case "discovery":
        return <Discovery />;
      
      case "you":
        return <Profile />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-chat">
      {/* Main Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="h-16 bg-card border-t border-border flex items-center justify-around px-4">
        <Button
          variant={activeTab === "chat" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("chat")}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
        
        <Button
          variant={activeTab === "discovery" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("discovery")}
          className="flex items-center gap-2"
        >
          <Compass className="h-4 w-4" />
          Discovery
        </Button>
        
        <Button
          variant={activeTab === "you" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("you")}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          You
        </Button>
      </div>
    </div>
  );
}
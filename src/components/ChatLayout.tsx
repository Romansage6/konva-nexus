import { useState } from "react";
import { MessageCircle, Compass, User, Search, UserPlus, Users, Bell, Archive, MoreVertical, Lock, Clock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StoryRing } from "./StoryRing";
import { ChatItem } from "./ChatItem";

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

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  
  // Mock data - will be replaced with real data from Supabase
  const stories: Story[] = [
    { id: "1", username: "alex", avatar: "", hasViewed: false },
    { id: "2", username: "maya", avatar: "", hasViewed: true },
    { id: "3", username: "jordan", avatar: "", hasViewed: false },
  ];

  const chats: Chat[] = [
    {
      id: "1",
      name: "Alex Chen",
      avatar: "",
      lastMessage: "Hey! How's it going?",
      timestamp: "2m ago",
      unreadCount: 2,
      isGroup: false,
      isOnline: true,
      status: "online"
    },
    {
      id: "2", 
      name: "Design Team",
      avatar: "",
      lastMessage: "Maya: The new mockups look great! 🎨",
      timestamp: "1h ago",
      unreadCount: 0,
      isGroup: true
    },
    {
      id: "3",
      name: "Jordan Smith", 
      avatar: "",
      lastMessage: "Thanks for the help earlier",
      timestamp: "3h ago", 
      unreadCount: 0,
      isGroup: false,
      status: "idle"
    }
  ];

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
                    <StoryRing
                      key={story.id}
                      username={story.username}
                      avatar={story.avatar}
                      hasViewed={story.hasViewed}
                      onClick={() => console.log(`View story: ${story.username}`)}
                    />
                  ))}
                </div>
              )}

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2 text-xs text-muted-foreground bg-muted/50 border-b border-border text-center">
                  Messages older than 7 days will be automatically removed to protect your privacy
                </div>
                {chats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    id={chat.id}
                    name={chat.name}
                    avatar={chat.avatar}
                    lastMessage={chat.lastMessage}
                    timestamp={chat.timestamp}
                    unreadCount={chat.unreadCount}
                    isGroup={chat.isGroup}
                    status={chat.status}
                    onClick={() => console.log(`Open chat: ${chat.name}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      
      case "discovery":
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Compass className="h-16 w-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Discovery</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>🎌 Manga Hub</p>
                <p>📺 Anime Hub</p>
                <p>🤖 AI Interface</p>
              </div>
            </div>
          </div>
        );
      
      case "you":
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <User className="h-16 w-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Profile & Settings</h2>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        );
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
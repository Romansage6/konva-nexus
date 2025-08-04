import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface ChatItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  isOnline?: boolean;
  status?: "online" | "idle" | "offline" | "stealth";
  onClick?: () => void;
}

export function ChatItem({ 
  name, 
  avatar, 
  lastMessage, 
  timestamp, 
  unreadCount, 
  isGroup, 
  status,
  onClick 
}: ChatItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-status-online";
      case "idle": return "bg-status-idle"; 
      case "stealth": return "bg-status-stealth";
      default: return "bg-status-offline";
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-gradient-primary text-white">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {!isGroup && status && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(status)}`} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{name}</h3>
            {isGroup && (
              <Users className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
      </div>
      
      {unreadCount > 0 && (
        <Badge variant="default" className="bg-primary text-primary-foreground">
          {unreadCount}
        </Badge>
      )}
    </div>
  );
}
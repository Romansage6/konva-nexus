import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryRingProps {
  username: string;
  avatar?: string;
  hasViewed: boolean;
  onClick?: () => void;
}

export function StoryRing({ username, avatar, hasViewed, onClick }: StoryRingProps) {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      <div className={`p-0.5 rounded-full transition-all duration-300 ${
        hasViewed ? 'bg-story-viewed' : 'story-ring'
      }`}>
        <Avatar className="h-12 w-12 border-2 border-background">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-xs bg-gradient-primary text-white">
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-xs text-muted-foreground mt-1 truncate w-full text-center">
        {username}
      </span>
    </div>
  );
}
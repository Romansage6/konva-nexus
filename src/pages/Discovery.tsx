import { useState } from "react";
import { Book, Play, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MangaHub } from "./DiscoveryTabs/MangaHub";
import { AnimeHub } from "./DiscoveryTabs/AnimeHub";
import { AIInterface } from "./DiscoveryTabs/AIInterface";

type DiscoveryTab = "manga" | "anime" | "ai";

export default function Discovery() {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>("manga");

  const tabs = [
    { id: "manga" as const, label: "Manga Hub", icon: Book, emoji: "🎌" },
    { id: "anime" as const, label: "Anime Hub", icon: Play, emoji: "📺" },
    { id: "ai" as const, label: "AI Interface", icon: Bot, emoji: "🤖" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "manga":
        return <MangaHub />;
      case "anime":
        return <AnimeHub />;
      case "ai":
        return <AIInterface />;
      default:
        return <MangaHub />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="flex">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="flex-1 rounded-none border-r border-border last:border-r-0 h-14"
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.emoji}</span>
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}


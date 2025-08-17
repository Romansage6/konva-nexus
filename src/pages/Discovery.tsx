import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

// Import each tab component
import MoviesTab from "./DiscoveryTabs/MoviesHub";
import TvTab from "./DiscoveryTabs/TvHub";
import AnimeTab from "./DiscoveryTabs/AnimeHub"; // ✅ Added import

export default function Discovery() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Discover</h1>

      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV</TabsTrigger>
          <TabsTrigger value="anime">Anime</TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <MoviesTab />
        </TabsContent>

        <TabsContent value="tv">
          <TvTab />
        </TabsContent>

        <TabsContent value="anime">
          {/* ✅ Instead of dummy div, now renders the real Anime Hub */}
          <AnimeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

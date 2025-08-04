import { useState } from "react";
import { Search, Play, Star, TrendingUp, Filter, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AnimeHub() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock anime data - will be replaced with streaming API
  const trendingAnime = [
    {
      id: 1,
      title: "Jujutsu Kaisen",
      cover: "",
      rating: 9.0,
      episodes: 24,
      status: "Ongoing",
      genre: ["Action", "Supernatural"],
      year: 2023,
      description: "Students battle cursed spirits in modern Japan."
    },
    {
      id: 2,
      title: "Chainsaw Man",
      cover: "",
      rating: 8.9,
      episodes: 12,
      status: "Completed",
      genre: ["Action", "Horror"],
      year: 2022,
      description: "Denji's transformation into the Chainsaw Devil."
    },
    {
      id: 3,
      title: "Spy x Family",
      cover: "",
      rating: 9.3,
      episodes: 25,
      status: "Ongoing",
      genre: ["Comedy", "Action"],
      year: 2023,
      description: "A spy, assassin, and telepath form a fake family."
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Play className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Anime Hub</h1>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anime titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Action", "Romance", "Comedy", "Drama", "Fantasy", "Slice of Life"].map((category) => (
          <Badge key={category} variant="secondary" className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground">
            {category}
          </Badge>
        ))}
      </div>

      {/* Trending Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Popular This Season</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingAnime.map((anime) => (
            <Card key={anime.id} className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="relative aspect-[16/9] bg-gradient-primary rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <Play className="h-12 w-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {anime.year}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{anime.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{anime.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{anime.episodes} eps</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {anime.genre.slice(0, 2).map((g) => (
                      <Badge key={g} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant={anime.status === "Ongoing" ? "default" : "secondary"}>
                    {anime.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {anime.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Integration Notice */}
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">
          🚧 Anime streaming will be integrated with free streaming API
        </p>
      </div>
    </div>
  );
}
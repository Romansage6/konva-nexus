import { useState } from "react";
import { Search, Book, Star, TrendingUp, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MangaHub() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock manga data - will be replaced with MangaDex API
  const trendingManga = [
    {
      id: 1,
      title: "Attack on Titan",
      cover: "",
      rating: 9.2,
      status: "Completed",
      genre: ["Action", "Drama"],
      description: "Humanity fights for survival against giant humanoid Titans."
    },
    {
      id: 2,
      title: "One Piece",
      cover: "",
      rating: 9.8,
      status: "Ongoing",
      genre: ["Adventure", "Comedy"],
      description: "Monkey D. Luffy's quest to become the Pirate King."
    },
    {
      id: 3,
      title: "Demon Slayer",
      cover: "",
      rating: 9.1,
      status: "Completed",
      genre: ["Action", "Supernatural"],
      description: "Tanjiro's journey to save his demon sister."
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Manga Hub</h1>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search manga titles..."
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
        {["All", "Action", "Romance", "Comedy", "Drama", "Fantasy", "Horror"].map((category) => (
          <Badge key={category} variant="secondary" className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground">
            {category}
          </Badge>
        ))}
      </div>

      {/* Trending Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingManga.map((manga) => (
            <Card key={manga.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-[3/4] bg-gradient-primary rounded-lg mb-3 flex items-center justify-center">
                  <Book className="h-12 w-12 text-white opacity-50" />
                </div>
                <CardTitle className="text-lg">{manga.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{manga.rating}</span>
                  </div>
                  <Badge variant={manga.status === "Ongoing" ? "default" : "secondary"}>
                    {manga.status}
                  </Badge>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  {manga.genre.map((g) => (
                    <Badge key={g} variant="outline" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {manga.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Integration Notice */}
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">
          🚧 Manga data will be integrated with MangaDex API
        </p>
      </div>
    </div>
  );
}
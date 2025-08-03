import { useState } from "react";
import { Search, BookOpen, Play, Bot, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real API data
  const mangaList = [
    {
      id: "1",
      title: "Attack on Titan",
      author: "Hajime Isayama",
      cover: "",
      rating: 9.0,
      status: "Completed",
      description: "Humanity fights for survival against giant humanoid Titans."
    },
    {
      id: "2", 
      title: "One Piece",
      author: "Eiichiro Oda",
      cover: "",
      rating: 9.2,
      status: "Ongoing",
      description: "Follow Monkey D. Luffy on his quest to become the Pirate King."
    }
  ];

  const animeList = [
    {
      id: "1",
      title: "Demon Slayer",
      studio: "Ufotable",
      cover: "",
      rating: 8.7,
      year: 2019,
      description: "A young boy becomes a demon slayer to save his sister."
    },
    {
      id: "2",
      title: "Jujutsu Kaisen", 
      studio: "MAPPA",
      cover: "",
      rating: 8.9,
      year: 2020,
      description: "Students fight cursed spirits in modern-day Japan."
    }
  ];

  const trendingTopics = [
    "Latest anime releases",
    "Manga recommendations",
    "AI predictions for 2024",
    "Best streaming platforms",
    "Upcoming movie trailers"
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold gradient-text">Discovery Hub</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search manga, anime, or ask AI anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0 h-12"
          />
        </div>
      </div>

      {/* Discovery Tabs */}
      <Tabs defaultValue="manga" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manga" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Manga Hub
          </TabsTrigger>
          <TabsTrigger value="anime" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Anime Hub
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Interface
          </TabsTrigger>
        </TabsList>

        {/* Manga Hub */}
        <TabsContent value="manga" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Popular Manga</h2>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mangaList.map((manga) => (
              <Card key={manga.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="aspect-[3/4] bg-gradient-primary rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-lg">{manga.title}</CardTitle>
                  <CardDescription>by {manga.author}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{manga.rating}</span>
                    </div>
                    <Badge variant={manga.status === "Ongoing" ? "default" : "secondary"}>
                      {manga.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {manga.description}
                  </p>
                  <Button className="w-full">Read Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Anime Hub */}
        <TabsContent value="anime" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending Anime</h2>
            <Button variant="outline">Browse All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animeList.map((anime) => (
              <Card key={anime.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gradient-neon rounded-lg mb-3 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-lg">{anime.title}</CardTitle>
                  <CardDescription>{anime.studio} • {anime.year}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{anime.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {anime.description}
                  </p>
                  <Button className="w-full">Watch Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Interface */}
        <TabsContent value="ai" className="space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">AI Assistant</h2>
              <p className="text-muted-foreground">
                Ask me anything! I can help with recommendations, answer questions, or discuss trending topics.
              </p>
            </div>

            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Chat with AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 bg-muted rounded-lg p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-card p-3 rounded-lg flex-1">
                        <p className="text-sm">
                          Hello! I'm your AI assistant. You can ask me about anime, manga, or any other topic. What would you like to know?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Discovery;
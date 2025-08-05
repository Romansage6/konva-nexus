import { useState, useEffect } from "react"
import { Search, Book, Star, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Manga {
  id: string
  title: string
  description: string
  coverArt: string
  rating: number
  views: number
  genres: string[]
  status: string
  lastUpdated: string
}

export default function MangaHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mangaList, setMangaList] = useState<Manga[]>([])
  const [loading, setLoading] = useState(false)

  // Mock manga data - replace with MangaDex API integration
  const mockManga: Manga[] = [
    {
      id: "1",
      title: "One Piece",
      description: "Follow Monkey D. Luffy on his quest to become the Pirate King!",
      coverArt: "",
      rating: 9.5,
      views: 1000000,
      genres: ["Adventure", "Comedy", "Drama"],
      status: "Ongoing",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2", 
      title: "Attack on Titan",
      description: "Humanity fights for survival against giant titans.",
      coverArt: "",
      rating: 9.2,
      views: 800000,
      genres: ["Action", "Drama", "Fantasy"],
      status: "Completed",
      lastUpdated: "2023-11-05"
    },
    {
      id: "3",
      title: "Demon Slayer",
      description: "A young boy becomes a demon slayer to save his sister.",
      coverArt: "",
      rating: 8.9,
      views: 600000,
      genres: ["Action", "Supernatural", "Historical"],
      status: "Completed", 
      lastUpdated: "2023-12-20"
    }
  ]

  useEffect(() => {
    // Initialize with mock data
    setMangaList(mockManga)
  }, [])

  const filteredManga = mangaList.filter(manga =>
    manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manga.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Manga Hub</h1>
            <p className="text-muted-foreground">Discover and read amazing manga</p>
          </div>
          <Book className="h-8 w-8 text-primary" />
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search manga by title or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Manga Grid */}
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredManga.map((manga) => (
            <Card key={manga.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="p-4">
                <div className="aspect-[3/4] bg-gradient-primary rounded-lg mb-3 flex items-center justify-center">
                  <Book className="h-12 w-12 text-white opacity-50" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {manga.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {manga.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{manga.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {(manga.views / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <Badge variant={manga.status === 'Ongoing' ? 'default' : 'secondary'}>
                    {manga.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {manga.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full" size="sm">
                  Read Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredManga.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No manga found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or browse all manga
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
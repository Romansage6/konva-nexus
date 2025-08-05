import { useState, useEffect } from "react"
import { Search, Play, Star, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Anime {
  id: string
  title: string
  description: string
  poster: string
  rating: number
  year: number
  episodes: number
  genres: string[]
  status: string
  studio: string
}

export default function AnimeHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)

  // Mock anime data - replace with real anime API integration
  const mockAnime: Anime[] = [
    {
      id: "1",
      title: "Demon Slayer: Kimetsu no Yaiba",
      description: "A young boy becomes a demon slayer to turn his sister back to human.",
      poster: "",
      rating: 8.9,
      year: 2019,
      episodes: 44,
      genres: ["Action", "Supernatural", "Historical"],
      status: "Completed",
      studio: "Ufotable"
    },
    {
      id: "2",
      title: "Jujutsu Kaisen",
      description: "Students at a school for jujutsu sorcerers battle cursed spirits.",
      poster: "",
      rating: 8.7,
      year: 2020,
      episodes: 24,
      genres: ["Action", "School", "Supernatural"],
      status: "Ongoing",
      studio: "MAPPA"
    },
    {
      id: "3",
      title: "Attack on Titan",
      description: "Humanity fights for survival against giant titans.",
      poster: "",
      rating: 9.2,
      year: 2013,
      episodes: 87,
      genres: ["Action", "Drama", "Fantasy"],
      status: "Completed",
      studio: "Wit Studio / MAPPA"
    },
    {
      id: "4",
      title: "My Hero Academia",
      description: "A world where most people have superpowers called 'Quirks'.",
      poster: "",
      rating: 8.5,
      year: 2016,
      episodes: 138,
      genres: ["Action", "School", "Superhero"],
      status: "Ongoing", 
      studio: "Bones"
    }
  ]

  useEffect(() => {
    // Initialize with mock data
    setAnimeList(mockAnime)
  }, [])

  const filteredAnime = animeList.filter(anime =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anime.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
    anime.studio.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Anime Hub</h1>
            <p className="text-muted-foreground">Watch your favorite anime series</p>
          </div>
          <Play className="h-8 w-8 text-primary" />
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anime by title, genre, or studio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Anime Grid */}
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnime.map((anime) => (
            <Card key={anime.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="p-4">
                <div className="aspect-[3/4] bg-gradient-primary rounded-lg mb-3 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-50" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {anime.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {anime.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{anime.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{anime.year}</span>
                  </div>
                  <Badge variant={anime.status === 'Ongoing' ? 'default' : 'secondary'}>
                    {anime.status}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">
                    {anime.episodes} episodes • {anime.studio}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {anime.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredAnime.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No anime found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or browse all anime
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
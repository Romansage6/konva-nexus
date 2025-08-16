import React from "react";
import { queries, fetchAniList, type AniMedia } from "@/lib/anilist";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AnimeGrid from "@/components/anime/AnimeGrid";
import { useNavigate } from "react-router-dom";

export default function AnimeTab() {
  const [tab, setTab] = React.useState<"trending" | "airing" | "upcoming" | "search">("trending");
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<AniMedia[]>([]);
  const nav = useNavigate();

  const run = React.useCallback(async () => {
    setLoading(true);
    try {
      let data: any;
      if (tab === "trending")
        data = await fetchAniList<{ Page: { media: AniMedia[] } }>(queries.trending, { page: 1, perPage: 20 });
      if (tab === "airing")
        data = await fetchAniList<{ Page: { media: AniMedia[] } }>(queries.topAiring, { page: 1, perPage: 20 });
      if (tab === "upcoming")
        data = await fetchAniList<{ Page: { media: AniMedia[] } }>(queries.upcoming, { page: 1, perPage: 20 });
      if (tab === "search" && query.trim())
        data = await fetchAniList<{ Page: { media: AniMedia[] } }>(queries.search, { search: query, page: 1, perPage: 30 });

      setItems(data?.Page?.media ?? []);
    } finally {
      setLoading(false);
    }
  }, [tab, query]);

  React.useEffect(() => {
    run();
  }, [tab, run]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTab("search");
    run();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submitSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime by title…"
        />
        <Button type="submit" className="gap-1">
          <Search className="w-4 h-4" />
          Search
        </Button>
      </form>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="trending">Trending Now</TabsTrigger>
          <TabsTrigger value="airing">Top Airing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Season</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <AnimeGrid
          items={items}
          onDetails={(id) => nav(`/anime/${id}`)}
          onWatch={(id) => nav(`/anime/${id}?autoPlay=1`)}
        />
      )}
    </div>
  );
}

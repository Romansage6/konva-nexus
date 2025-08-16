// src/routes/discovery/AnimeTab.tsx
import React from "react";
import { queries, fetchAniList, type AniMedia } from "@/lib/anilist";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AnimeGrid } from "@/components/anime/AnimeGrid";

export default function AnimeTab() {
  const [tab, setTab] =
    React.useState<"trending" | "airing" | "upcoming" | "search">("trending");
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<AniMedia[]>([]);
  const controller = React.useRef<AbortController | null>(null);

  const run = React.useCallback(
    async (activeTab = tab, q = query) => {
      controller.current?.abort();
      controller.current = new AbortController();
      setLoading(true);
      try {
        let data: any;
        if (activeTab === "trending")
          data = await fetchAniList<{ Page: { media: AniMedia[] } }>(
            queries.trending,
            { page: 1, perPage: 20 }
          );
        if (activeTab === "airing")
          data = await fetchAniList<{ Page: { media: AniMedia[] } }>(
            queries.topAiring,
            { page: 1, perPage: 20 }
          );
        if (activeTab === "upcoming")
          data = await fetchAniList<{ Page: { media: AniMedia[] } }>(
            queries.upcoming,
            { page: 1, perPage: 20 }
          );
        if (activeTab === "search" && q.trim())
          data = await fetchAniList<{ Page: { media: AniMedia[] } }>(
            queries.search,
            { search: q, page: 1, perPage: 30 }
          );
        setItems(data?.Page?.media ?? []);
      } finally {
        setLoading(false);
      }
    },
    [tab, query]
  );

  React.useEffect(() => {
    run("trending");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTab("search");
    run("search", query);
  };

  return (
    <div
      className="space-y-6"
      // Critical if Konva overlays exist:
      style={{ pointerEvents: "auto" }}
    >
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
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="trending" onClick={() => run("trending")}>
            Trending Now
          </TabsTrigger>
          <TabsTrigger value="airing" onClick={() => run("airing")}>
            Top Airing
          </TabsTrigger>
          <TabsTrigger value="upcoming" onClick={() => run("upcoming")}>
            Upcoming Season
          </TabsTrigger>
          <TabsTrigger value="search" onClick={() => run("search", query)}>
            Search
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <AnimeGrid items={items} />
      )}
    </div>
  );
}

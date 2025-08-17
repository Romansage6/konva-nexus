// src/pages/DiscoveryTabs/AnimeHub.tsx
import React from "react";
import { queries, fetchAniList, type AniMedia, type AniPage } from "@/lib/anilist";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AnimeGrid } from "@/components/anime/AnimeGrid";

type TabKey = "trending" | "airing" | "upcoming" | "search";

export default function AnimeTab() {
  const [tab, setTab] = React.useState<TabKey>("trending");
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<AniMedia[]>([]);
  const controller = React.useRef<AbortController | null>(null);

  const run = React.useCallback(async (nextTab: TabKey, q?: string) => {
    setTab(nextTab);
    setLoading(true);
    controller.current?.abort();
    controller.current = new AbortController();

    try {
      let data: AniPage | null = null;
      if (nextTab === "trending") {
        data = await fetchAniList<AniPage>(queries.trending, { page: 1, perPage: 20 });
      } else if (nextTab === "airing") {
        data = await fetchAniList<AniPage>(queries.topAiring, { page: 1, perPage: 20 });
      } else if (nextTab === "upcoming") {
        data = await fetchAniList<AniPage>(queries.upcoming, { page: 1, perPage: 20 });
      } else if (nextTab === "search") {
        const searchTerm = (q ?? query).trim();
        if (!searchTerm) {
          setItems([]);
          setLoading(false);
          return;
        }
        data = await fetchAniList<AniPage>(queries.search, { search: searchTerm, page: 1, perPage: 30 });
      }
      setItems(data?.Page.media ?? []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  React.useEffect(() => {
    run("trending");
  }, [run]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    run("search", query);
  }

  return (
    <div className="space-y-4" style={{ pointerEvents: "auto" }}>
      <Tabs value={tab} onValueChange={(v) => run(v as TabKey)}>
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="airing">Top Airing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "search" && (
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            placeholder="Search anime…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" className="gap-1">
            <Search className="w-4 h-4" /> Search
          </Button>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <AnimeGrid items={items} />
      )}
    </div>
  );
}

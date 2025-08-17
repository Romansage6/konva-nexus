// src/pages/DiscoveryTabs/AnimeDetails.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAniList, queries, type AniMedia } from "@/lib/anilist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EnimeEpisode = {
  number: number;
  title?: string;
  sources: { url: string; quality?: string }[];
};

type EnimeResponse = {
  id: string;
  title: string;
  episodes: EnimeEpisode[];
};

export default function AnimeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = React.useState<AniMedia | null>(null);
  const [episodes, setEpisodes] = React.useState<EnimeEpisode[]>([]);
  const [currentEp, setCurrentEp] = React.useState<EnimeEpisode | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        // AniList metadata
        const data = await fetchAniList<{ Media: AniMedia }>(queries.byId, { id: Number(id) });
        setAnime(data.Media);

        // Enime episodes
        const res = await fetch(`https://api.enime.moe/anime/${id}`);
        if (res.ok) {
          const json: EnimeResponse = await res.json();
          setEpisodes(json.episodes ?? []);
          if (json.episodes.length > 0) {
            setCurrentEp(json.episodes[0]);
          }
        }
      } catch (e) {
        console.error("AnimeDetails error", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function playEp(ep: EnimeEpisode) {
    setCurrentEp(ep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) return <div className="p-4">Loading…</div>;
  if (!anime) return <div className="p-4">Anime not found.</div>;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={anime.coverImage?.extraLarge || anime.coverImage?.large}
          alt={anime.title.english || anime.title.romaji}
          className="w-48 rounded-lg shadow"
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold">
            {anime.title.english || anime.title.romaji}
          </h1>
          <div className="flex gap-2 flex-wrap text-sm text-muted-foreground">
            {anime.genres?.map((g) => (
              <span key={g} className="bg-secondary px-2 py-1 rounded">
                {g}
              </span>
            ))}
          </div>
          <p
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: anime.description || "" }}
          />
          {anime.trailer?.site === "youtube" && (
            <Button
              onClick={() =>
                window.open(`https://youtube.com/watch?v=${anime.trailer?.id}`, "_blank")
              }
            >
              Watch Trailer
            </Button>
          )}
        </div>
      </div>

      {/* Video Player */}
      {currentEp && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            Episode {currentEp.number}: {currentEp.title || ""}
          </h2>
          <video
            src={currentEp.sources[0]?.url}
            controls
            className="w-full rounded-lg shadow"
          />
          <div className="flex justify-between">
            <Button
              disabled={currentEp.number <= 1}
              onClick={() => {
                const prev = episodes.find((e) => e.number === currentEp.number - 1);
                if (prev) playEp(prev);
              }}
            >
              ◀ Prev
            </Button>
            <Button
              disabled={currentEp.number >= episodes.length}
              onClick={() => {
                const next = episodes.find((e) => e.number === currentEp.number + 1);
                if (next) playEp(next);
              }}
            >
              Next ▶
            </Button>
          </div>
        </div>
      )}

      {/* Episode list */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Episodes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {episodes.map((ep) => (
            <Card
              key={ep.number}
              className={`cursor-pointer hover:ring-2 ${
                currentEp?.number === ep.number ? "ring-primary" : ""
              }`}
              onClick={() => playEp(ep)}
            >
              <CardContent className="p-2">
                <div className="font-semibold">Ep {ep.number}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {ep.title}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>
    </div>
  );
}

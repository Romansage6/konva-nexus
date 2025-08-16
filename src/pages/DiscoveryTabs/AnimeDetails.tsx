// src/routes/anime/AnimeDetails.tsx
import React from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { fetchAniList, queries, type AniMedia } from "@/lib/anilist";
import { fetchEnimeByAniListId, type EnimeEpisode } from "@/lib/enime";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Play, Link2 } from "lucide-react";

export default function AnimeDetails() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [meta, setMeta] = React.useState<AniMedia | null>(null);
  const [episodes, setEpisodes] = React.useState<EnimeEpisode[]>([]);
  const [current, setCurrent] = React.useState<number | null>(null);

  React.useEffect(() => {
    const anilistId = Number(id);
    if (!anilistId) return;

    (async () => {
      const res = await fetchAniList<{ Media: AniMedia }>(queries.byId, {
        id: anilistId,
      });
      setMeta(res.Media);

      const enime = await fetchEnimeByAniListId(anilistId);
      const eps = enime?.episodes || [];
      setEpisodes(eps);

      if (sp.get("autoPlay") && eps[0]?.number != null) {
        setCurrent(eps[0].number);
      }
    })();
  }, [id, sp]);

  const title =
    meta?.title?.english || meta?.title?.romaji || meta?.title?.native || "Anime";

  const trailerUrl =
    meta?.trailer?.site?.toLowerCase() === "youtube" && meta.trailer.id
      ? `https://www.youtube.com/watch?v=${meta.trailer.id}`
      : null;

  return (
    <div className="space-y-6" style={{ pointerEvents: "auto" }}>
      <Button variant="ghost" className="gap-1" onClick={() => nav(-1)}>
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
          <img
            src={meta.coverImage.extraLarge || meta.coverImage.large}
            alt={title}
            className="rounded-2xl w-full h-auto object-cover"
          />
          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
            <div className="flex flex-wrap gap-2">
              {(meta.genres || []).map((g) => (
                <Badge key={g} variant="secondary">
                  {g}
                </Badge>
              ))}
            </div>
            {meta.averageScore != null && (
              <div className="text-sm">
                Average score: <span className="font-semibold">{meta.averageScore}%</span>
              </div>
            )}
            {meta.episodes != null && (
              <div className="text-sm">
                Episodes: <span className="font-semibold">{meta.episodes}</span>
              </div>
            )}
            {trailerUrl && (
              <Button asChild variant="outline" className="gap-1">
                <a href={trailerUrl} target="_blank" rel="noreferrer">
                  <Link2 className="w-4 h-4" />
                  Trailer
                </a>
              </Button>
            )}
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: meta.description || "" }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Player */}
      {current != null && (
        <EpisodePlayer
          number={current}
          onPrev={() => setCurrent((n) => (n ?? 1) - 1)}
          onNext={() => setCurrent((n) => (n ?? 0) + 1)}
          episodes={episodes}
        />
      )}

      {/* Episode list */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Episodes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {episodes.map((ep) => (
            <Button
              key={ep.number}
              variant={current === ep.number ? "default" : "secondary"}
              onClick={() => setCurrent(ep.number)}
              className="justify-between"
            >
              <span>Ep {ep.number}</span>
              {ep.title ? (
                <span className="truncate max-w-[8rem] text-xs opacity-80">
                  {ep.title}
                </span>
              ) : null}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EpisodePlayer({
  number,
  onPrev,
  onNext,
  episodes,
}: {
  number: number;
  onPrev: () => void;
  onNext: () => void;
  episodes: EnimeEpisode[];
}) {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const ep = episodes.find((e) => e.number === number);
    const url = ep?.sources?.[0]?.url || null;
    setSrc(url);
  }, [number, episodes]);

  const hasPrev = episodes.some((e) => e.number === number - 1);
  const hasNext = episodes.some((e) => e.number === number + 1);

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        {src ? (
          <video
            key={src}
            controls
            className="w-full rounded-lg"
            src={src}
            playsInline
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            Source not available for this episode.
          </div>
        )}
        <div className="flex justify-between">
          <Button onClick={onPrev} disabled={!hasPrev} variant="outline">
            Previous
          </Button>
          <div className="text-sm font-medium">Episode {number}</div>
          <Button onClick={onNext} disabled={!hasNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

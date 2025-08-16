// src/components/anime/AnimeCard.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { Link } from "react-router-dom";
import type { AniMedia } from "@/lib/anilist";

export function AnimeCard({ item }: { item: AniMedia }) {
  const title =
    item.title.english || item.title.romaji || item.title.native || "Untitled";
  const desc = (item.description || "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/(<([^>]+)>)/gi, "");
  const short = desc.length > 140 ? desc.slice(0, 140) + "…" : desc;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <Link
        to={`/anime/${item.id}`}
        className="block"
        // Ensure clicks are not swallowed by any overlay:
        style={{ pointerEvents: "auto" }}
      >
        <div className="aspect-[3/4] w-full bg-muted overflow-hidden">
          <img
            src={item.coverImage.large}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      </Link>

      <CardHeader className="py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2">{title}</h3>
          {item.averageScore ? (
            <div className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
              {item.averageScore}%
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{short}</p>
        <div className="flex flex-wrap gap-1">
          {(item.genres || [])
            .slice(0, 3)
            .map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">
                {g}
              </Badge>
            ))}
        </div>
        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" className="gap-1">
            <Link to={`/anime/${item.id}?autoPlay=1`}>
              <Play className="w-4 h-4" /> Watch
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1">
            <Link to={`/anime/${item.id}`}>
              <Info className="w-4 h-4" /> Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

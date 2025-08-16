import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import type { AniMedia } from "@/lib/anilist";

export default function AnimeCard({
  item,
  onDetails,
  onWatch,
}: {
  item: AniMedia;
  onDetails: (id: number) => void;
  onWatch: (id: number) => void;
}) {
  const title =
    item.title.english || item.title.romaji || item.title.native || "Untitled";

  const desc = (item.description || "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/(<([^>]+)>)/gi, "");
  const short = desc.length > 140 ? desc.slice(0, 140) + "…" : desc;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-[3/4] w-full bg-muted overflow-hidden">
        <img
          src={item.coverImage.large}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
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
          <Button
            size="sm"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onWatch(item.id);
            }}
          >
            <Play className="w-4 h-4" /> Watch
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onDetails(item.id);
            }}
          >
            <Info className="w-4 h-4" /> Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

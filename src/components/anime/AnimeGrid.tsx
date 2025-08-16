import React from "react";
import AnimeCard from "./AnimeCard";
import type { AniMedia } from "@/lib/anilist";

export default function AnimeGrid({
  items,
  onDetails,
  onWatch,
}: {
  items: AniMedia[];
  onDetails: (id: number) => void;
  onWatch: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((it) => (
        <AnimeCard
          key={it.id}
          item={it}
          onDetails={onDetails}
          onWatch={onWatch}
        />
      ))}
    </div>
  );
}

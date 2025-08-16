// src/components/anime/AnimeGrid.tsx
import React from "react";
import { AnimeCard } from "./AnimeCard";
import type { AniMedia } from "@/lib/anilist";

export function AnimeGrid({ items }: { items: AniMedia[] }) {
  return (
    <div
      className="anime-click-surface grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      // Critical if this is rendered above/inside a Konva canvas container:
      style={{ pointerEvents: "auto" }}
    >
      {items.map((it) => (
        <AnimeCard key={it.id} item={it} />
      ))}
    </div>
  );
}

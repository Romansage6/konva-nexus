"use client";

import { useEffect, useState } from "react";
import { getTrendingAnime } from "@/lib/animeApi";
import AnimeDetails from "./AnimeDetails";

export default function AnimeHub() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const trending = await getTrendingAnime();
      setAnimeList(trending);
    })();
  }, []);

  if (selectedAnime) {
    return (
      <AnimeDetails anime={selectedAnime} onBack={() => setSelectedAnime(null)} />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trending Anime</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {animeList.map((anime) => (
          <div
            key={anime.id}
            className="bg-gray-800 p-2 rounded-xl cursor-pointer hover:scale-105 transition"
            onClick={() => setSelectedAnime(anime)}
          >
            <img
              src={anime.coverImage.large}
              alt={anime.title.english || anime.title.romaji}
              className="rounded-lg w-full"
            />
            <h2 className="mt-2 text-sm text-center">
              {anime.title.english || anime.title.romaji}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

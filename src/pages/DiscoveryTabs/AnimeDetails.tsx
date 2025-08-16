"use client";

import { useEffect, useState } from "react";
import { getEpisodes } from "@/lib/animeApi";
import ReactPlayer from "react-player";

export default function AnimeDetails({ anime, onBack }: { anime: any; onBack: () => void }) {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getEpisodes(anime.id);
      if (data?.episodes) setEpisodes(data.episodes);
    })();
  }, [anime]);

  return (
    <div className="p-4">
      <button
        className="mb-4 px-3 py-1 bg-purple-600 text-white rounded-lg"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={anime.coverImage.large}
          alt={anime.title.english}
          className="rounded-lg w-60"
        />
        <div>
          <h1 className="text-2xl font-bold">{anime.title.english || anime.title.romaji}</h1>
          <p
            className="mt-2 text-sm text-gray-300"
            dangerouslySetInnerHTML={{ __html: anime.description }}
          />
          <p className="mt-2">⭐ {anime.averageScore}%</p>
          <p>Genres: {anime.genres.join(", ")}</p>
          <p>Total Episodes: {anime.episodes || "?"}</p>
        </div>
      </div>

      {currentEpisode ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Episode {currentEpisode.number}: {currentEpisode.title}</h2>
          <ReactPlayer
            url={currentEpisode.sources[0].url}
            controls
            width="100%"
            height="500px"
          />
          <div className="flex gap-2 mt-4 flex-wrap">
            {episodes.map((ep) => (
              <button
                key={ep.number}
                onClick={() => setCurrentEpisode(ep)}
                className={`px-3 py-1 rounded-lg ${ep.number === currentEpisode.number ? "bg-purple-600" : "bg-gray-700"} text-white`}
              >
                Ep {ep.number}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Episodes</h2>
          <div className="flex gap-2 flex-wrap mt-2">
            {episodes.map((ep) => (
              <button
                key={ep.number}
                onClick={() => setCurrentEpisode(ep)}
                className="px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-purple-600"
              >
                Ep {ep.number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

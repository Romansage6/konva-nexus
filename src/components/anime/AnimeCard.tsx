// src/components/anime/AnimeCard.tsx
import { Link } from "react-router-dom";

export default function AnimeCard({ anime }: { anime: any }) {
  return (
    <div className="bg-gray-900 rounded-2xl shadow p-3 hover:scale-105 transition">
      <img
        src={anime.coverImage.large}
        alt={anime.title.english || anime.title.romaji}
        className="rounded-xl w-full h-56 object-cover"
      />
      <h3 className="mt-2 text-white text-sm font-bold truncate">
        {anime.title.english || anime.title.romaji}
      </h3>
      <Link
        to={`/discovery/anime/${anime.id}`}
        className="mt-2 block text-center bg-purple-600 hover:bg-purple-700 text-white py-1 rounded-lg"
      >
        Details
      </Link>
    </div>
  );
}

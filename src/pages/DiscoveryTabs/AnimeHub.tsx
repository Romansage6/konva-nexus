// src/pages/discovery/AnimeHub.tsx
import { useEffect, useState } from "react";
import { fetchAnime, TRENDING_QUERY, SEARCH_QUERY } from "../../lib/anilist";
import AnimeCard from "../../components/anime/AnimeCard";

export default function AnimeHub() {
  const [trending, setTrending] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTrending() {
      const data = await fetchAnime(TRENDING_QUERY, { page: 1, perPage: 12 });
      setTrending(data.data.Page.media);
    }
    loadTrending();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search) return;
    const data = await fetchAnime(SEARCH_QUERY, { search });
    setSearchResults(data.data.Page.media);
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white"
        />
      </form>

      {searchResults.length > 0 ? (
        <>
          <h2 className="text-xl text-white mb-2">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchResults.map((a) => (
              <AnimeCard key={a.id} anime={a} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl text-white mb-2">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map((a) => (
              <AnimeCard key={a.id} anime={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

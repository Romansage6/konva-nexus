// src/pages/discovery/AnimeDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAnime } from "../../lib/anilist";
import { fetchAnimeEpisodes } from "../../lib/enime";
import AnimePlayer from "../../components/anime/AnimePlayer";

export default function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEp, setCurrentEp] = useState<any | null>(null);

  useEffect(() => {
    async function loadDetails() {
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title { romaji english native }
            coverImage { large }
            description
            genres
            averageScore
            episodes
          }
        }
      `;
      const data = await fetchAnime(query, { id: Number(id) });
      setAnime(data.data.Media);

      const epData = await fetchAnimeEpisodes(Number(id));
      setEpisodes(epData.episodes || []);
    }
    loadDetails();
  }, [id]);

  return (
    <div className="p-4 text-white">
      {anime && (
        <>
          <div className="flex gap-4">
            <img
              src={anime.coverImage.large}
              alt={anime.title.english}
              className="w-48 rounded-xl"
            />
            <div>
              <h1 className="text-2xl font-bold">{anime.title.english || anime.title.romaji}</h1>
              <p dangerouslySetInnerHTML={{ __html: anime.description }} />
              <p className="mt-2">Genres: {anime.genres.join(", ")}</p>
              <p>Rating: {anime.averageScore}</p>
              <p>Total Episodes: {anime.episodes}</p>
            </div>
          </div>

          <h2 className="text-xl mt-6 mb-2">Episodes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {episodes.map((ep) => (
              <button
                key={ep.number}
                onClick={() => setCurrentEp(ep)}
                className="bg-gray-700 hover:bg-purple-600 py-2 px-3 rounded-lg"
              >
                Episode {ep.number}
              </button>
            ))}
          </div>

          {currentEp && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">{currentEp.title}</h3>
              <AnimePlayer episode={currentEp} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

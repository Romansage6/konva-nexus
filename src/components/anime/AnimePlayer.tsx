// src/components/anime/AnimePlayer.tsx
export default function AnimePlayer({ episode }: { episode: any }) {
  const source = episode.sources?.[0];
  if (!source) return <p>No video source found.</p>;

  return (
    <video
      src={source.url}
      controls
      className="w-full rounded-xl"
    />
  );
}

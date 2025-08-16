// src/lib/enime.ts
const ENIME_API = "https://api.enime.moe";

export async function fetchAnimeEpisodes(anilistId: number) {
  const res = await fetch(`${ENIME_API}/anime/${anilistId}`);
  return res.json();
}

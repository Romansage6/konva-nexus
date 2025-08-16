// src/lib/enime.ts
export type EnimeEpisodeSource = { url: string; quality?: string };
export type EnimeEpisode = {
  number: number;
  title?: string | null;
  sources?: EnimeEpisodeSource[];
};
export type EnimeAnime = {
  id: string;
  title?: string;
  episodes: EnimeEpisode[];
};

const ENIME_ENDPOINT = "https://api.enime.moe";

export async function fetchEnimeByAniListId(
  anilistId: number
): Promise<EnimeAnime | null> {
  try {
    const res = await fetch(`${ENIME_ENDPOINT}/anime/${anilistId}`);
    if (!res.ok) return null;
    return (await res.json()) as EnimeAnime;
  } catch {
    return null;
  }
}

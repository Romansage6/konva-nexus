const ANILIST_URL = "https://graphql.anilist.co";
const ENIME_URL = "https://api.enime.moe";

// AniList GraphQL fetcher
export async function fetchFromAniList(query: string, variables = {}) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  return json.data;
}

// Example: Trending Anime
export async function getTrendingAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 12) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          description
          genres
          averageScore
          episodes
          trailer { id site }
        }
      }
    }
  `;
  const data = await fetchFromAniList(query);
  return data.Page.media;
}

// Fetch episodes from Enime
export async function getEpisodes(anilistId: number) {
  const res = await fetch(`${ENIME_URL}/anime/${anilistId}`);
  if (!res.ok) return null;
  return res.json();
}

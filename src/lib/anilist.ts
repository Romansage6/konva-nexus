// src/lib/anilist.ts
export const ANILIST_API = "https://graphql.anilist.co";

export async function fetchAnime(query: string, variables: any = {}) {
  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

export const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
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

export const SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 12) {
      media(search: $search, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large }
      }
    }
  }
`;

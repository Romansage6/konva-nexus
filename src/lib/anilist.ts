// src/lib/anilist.ts
// Lightweight AniList GraphQL client (no external deps)

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export type AniTitle = { romaji?: string; english?: string; native?: string };
export type AniTrailer = { id?: string; site?: string | null };
export type AniMedia = {
  id: number;
  title: AniTitle;
  coverImage: { large: string; extraLarge?: string };
  description?: string | null;
  genres?: string[] | null;
  averageScore?: number | null;
  episodes?: number | null;
  trailer?: AniTrailer | null;
};

export type AniPage = { Page: { media: AniMedia[] } };

// Queries
export const queries = {
  trending: `
    query Trending($page: Int = 1, $perPage: Int = 10) {
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
  `,
  topAiring: `
    query TopAiring($page: Int = 1, $perPage: Int = 10) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, status: RELEASING) {
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
  `,
  upcoming: `
    query Upcoming($page: Int = 1, $perPage: Int = 10) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
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
  `,
  search: `
    query Search($search: String!, $page: Int = 1, $perPage: Int = 20) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME) {
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
  `,
  byId: `
    query ById($id: Int!) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large extraLarge }
        description
        genres
        averageScore
        episodes
        trailer { id site }
      }
    }
  `,
} as const;

// Minimal fetcher
export async function fetchAniList<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AniList error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.data as T;
}

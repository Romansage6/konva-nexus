// src/lib/anilist.ts
import { GraphQLClient, gql } from "graphql-request";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export const anilist = new GraphQLClient(ANILIST_ENDPOINT, {
  headers: { "Content-Type": "application/json" },
});

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

export const queries = {
  trending: gql`
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
  topAiring: gql`
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
  upcoming: gql`
    query Upcoming($page: Int = 1, $perPage: Int = 10) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, status: NOT_YET_RELEASED) {
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
  search: gql`
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
  byId: gql`
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
};

export async function fetchAniList<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  return anilist.request<T>(query, variables);
}

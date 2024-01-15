const API_URL = 'https://api.spotify.com/v1';

const defaultOptionsGET = (accessToken: string): RequestInit => {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  };
};

export type ImageType = {
  url: string;
  width: number;
  height: number;
};

export type DataType<T> = {
  href: string;
  items: T[];
  limit: number;
  offset: number;
  total: number;
};

/* Track */

export type TrackType = {
  album: Omit<
    AlbumType,
    | 'genres'
    | 'label'
    | 'popularity'
    | 'tracks'
    | 'copyrights'
    | 'available_markets'
    | 'external_ids'
    | 'album_group'
  >;
  artists: Omit<ArtistType, 'followers' | 'genres' | 'images' | 'popularity'>[];
  duration_ms: number;
  explicit: boolean;
  external_ids?: { [key: string]: string };
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  preview_url: string;
  type: 'track';
  uri: string;
  track_number?: number;
  disc_number?: number;
};

export async function fetchTrack(
  accessToken: string,
  id: string
): Promise<TrackType> {
  const res = await fetch(
    `${API_URL}/tracks/${id}?market=ES`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

export async function fetchSeveralTracks(
  accessToken: string,
  ids: string[],
  abortController: AbortController
): Promise<{ tracks: TrackType[] }[]> {
  let fetchArr: Promise<{ tracks: TrackType[] }>[] = [];

  for (let i = 0; i < ids.length; i += 50) {
    fetchArr.push(
      fetch(`${API_URL}/tracks?ids=${ids.slice(i, i + 50).join(',')}`, {
        ...defaultOptionsGET(accessToken),
        signal: abortController.signal,
      }).then((res) => res.json())
    );
  }

  return Promise.all(fetchArr);
}

export async function fetchArtistTopTracks(
  accessToken: string,
  id: string
): Promise<{ tracks: TrackType[] }> {
  const res = await fetch(
    `${API_URL}/artists/${id}/top-tracks?market=ES`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

/* Album */

export type AlbumType = {
  album_type: string;
  artists: Omit<ArtistType, 'followers' | 'genres' | 'images' | 'popularity'>[];
  external_urls: { [key: string]: string };
  genres: string[];
  href: string;
  id: string;
  images: ImageType[];
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: DataType<Omit<TrackType, 'album'>>;
  type: 'album';
  label?: string;
  copyrights?: { text: string; type: string }[];
  is_playable?: boolean;
  available_markets?: string[];
  external_ids?: { [key: string]: string };
  album_group?: string;
  uri?: string;
};

export async function fetchAlbum(
  accessToken: string,
  id: string
): Promise<AlbumType> {
  const res = await fetch(
    `${API_URL}/albums/${id}?market=ES`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

export async function fetchArtistAlbums(
  accessToken: string,
  id: string
): Promise<DataType<AlbumType>> {
  const res = await fetch(
    `${API_URL}/artists/${id}/albums?include_groups=album`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

/* Artist */

export type ArtistType = {
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
  followers: { href: string | null; total: number };
  genres: string[];
  images: ImageType[];
  popularity: number;
};

export async function fetchArtist(
  accessToken: string,
  id: string
): Promise<ArtistType> {
  const res = await fetch(
    `${API_URL}/artists/${id}`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}
export async function fetchArtistRelatedArtists(
  accessToken: string,
  id: string
): Promise<{ artists: ArtistType[] }> {
  const res = await fetch(
    `${API_URL}/artists/${id}/related-artists`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

/* Playlist */

export type PlaylistType = {
  collaborative: boolean;
  description: string;
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  images: ImageType[];
  name: string;
  owner: { display_name: string; external_urls: { [key: string]: string } };
  snapshot_id: string;
  tracks: DataType<{
    added_at: string;
    added_by: any;
    is_local: boolean;
    track: TrackType & { album: Omit<AlbumType, 'tracks'> };
  }>;
  type: 'playlist';
  uri: string;
};
export async function fetchPlaylist(
  accessToken: string,
  id: string
): Promise<PlaylistType> {
  const res = await fetch(
    `${API_URL}/playlists/${id}`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

export type PlaylistWithNoTracksType = PlaylistType & {
  tracks: { href: string; total: number };
};

export type FeaturedPlaylistsType = DataType<PlaylistWithNoTracksType>;

export async function fetchFeaturedPlaylists(
  accessToken: string,
  limit?: number
): Promise<FeaturedPlaylistsType> {
  const res = await fetch(
    `${API_URL}/browse/featured-playlists${limit ? '?limit=' + limit : ''}`,
    defaultOptionsGET(accessToken)
  );

  return (await res.json()).playlists;
}

export async function fetchCategoryPlaylists(
  categoryId: string,
  accessToken: string
): Promise<DataType<PlaylistWithNoTracksType>> {
  const res = await fetch(
    `${API_URL}/browse/categories/${categoryId}/playlists`,
    defaultOptionsGET(accessToken)
  );

  return (await res.json()).playlists;
}

/* Search */

export type SearchDataType = {
  artists: DataType<ArtistType>;
  tracks: DataType<TrackType>;
  albums: DataType<AlbumType>;
  playlists: DataType<PlaylistWithNoTracksType>;
};
export async function fetchSearch(
  accessToken: string,
  searchValue: string,
  limit?: number
): Promise<SearchDataType> {
  const res = await fetch(
    `${API_URL}/search?q=${searchValue}&type=artist,track,album,playlist${
      limit ? `&limit=${limit}` : ''
    }`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

// Browse Category

export type BrowseCategoryType = {
  href: string;
  icons: ImageType[];
  id: string;
  name: string;
};

export async function fetchSeveralBrowseCategories(
  accessToken: string,
  limit?: number
): Promise<DataType<BrowseCategoryType>> {
  const res = await fetch(
    `${API_URL}/browse/categories${limit ? `?limit=${limit}` : ''}`,
    defaultOptionsGET(accessToken)
  );

  return (await res.json()).categories;
}

export async function fetchSingleBrowseCategory(
  id: string,
  accessToken: string
): Promise<BrowseCategoryType> {
  const res = await fetch(
    `${API_URL}/browse/categories/${id}`,
    defaultOptionsGET(accessToken)
  );

  return res.json();
}

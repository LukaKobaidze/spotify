import { AlbumType, ArtistType, DataType, PlaylistType, TrackType } from '@/types';

export type SearchDataType = {
  artists: DataType<ArtistType>;
  tracks: DataType<TrackType>;
  albums: DataType<AlbumType>;
  playlists: DataType<PlaylistType>;
};

export async function fetchSearch(
  accessToken: string,
  searchValue: string,
  limit?: number
): Promise<SearchDataType> {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${searchValue}&type=artist,track,album,playlist${
      limit ? `&limit=${limit}` : ''
    }`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );

  return res.json();
}

export async function fetchArtist(
  accessToken: string,
  id: string
): Promise<ArtistType> {
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });

  return res.json();
}

export async function fetchArtistTopTracks(
  accessToken: string,
  id: string
): Promise<{ tracks: TrackType[] }> {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=ES`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );

  return res.json();
}

export async function fetchArtistAlbums(accessToken: string, id: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );

  return res.json();
}

export async function fetchArtistRelatedArtists(accessToken: string, id: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/related-artists`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );

  return res.json();
}

export async function fetchAlbum(
  accessToken: string,
  id: string
): Promise<AlbumType> {
  const res = await fetch(`https://api.spotify.com/v1/albums/${id}?market=ES`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });

  return res.json();
}

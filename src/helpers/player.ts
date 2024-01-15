import {
  AlbumType,
  ArtistType,
  PlaylistType,
  PlaylistWithNoTracksType,
  TrackType,
} from '@/services/spotify';

export function getPlayerId(
  data: PlaylistWithNoTracksType | PlaylistType | AlbumType | ArtistType | TrackType
) {
  if (!data?.type) return '';

  return data.type + data.id;
}

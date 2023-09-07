export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type DataType<T> = {
  href: string;
  items: T[];
  limit: number;
  offset: number;
  total: number;
};

export type ImageType = {
  url: string;
  width: number;
  height: number;
};

export type ArtistType = {
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  followers: { href: string | null; total: number };
  genres: string[];
  images: ImageType[];
  popularity: number;
};

export type TrackType = {
  album: AlbumType;
  artists: ArtistType[];
  duration_ms: number;
  explicit: boolean;
  external_ids?: {[key: string]: string}
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  preview_url: string;
  type: string;
  uri: string;
  track_number?: number;
  disc_number?: number;
};

export type AlbumType = {
  album_type: string;
  artists: Omit<ArtistType, 'followers' | 'genres' | 'images' | 'popularity'>[];
  external_urls: { [key: string]: string };
  genres: string[];
  href: string;
  id: string;
  images: ImageType[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: DataType<Omit<TrackType, 'album'>>;
  type: string;
  copyrights?: { text: string; type: string }[];
  is_playable?: boolean;
  available_markets?: string[];
  external_ids?: { [key: string]: string };
  album_group?: string;
  uri?: string;
};

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
  tracks: { href: string; total: number };
  type: string;
  uri: string;
};

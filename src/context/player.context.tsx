'use client';
import { createContext, useState, useCallback } from 'react';
import { getCookie } from 'cookies-next';
import { Optional } from '@/types';
import {
  AlbumType,
  ArtistType,
  PlaylistType,
  PlaylistWithNoTracksType,
  TrackType,
  fetchAlbum,
  fetchArtistTopTracks,
  fetchPlaylist,
} from '@/services/spotify';
import { getPlayerId } from '@/helpers';
import { useLocalStorageState } from '@/hooks';

export type PlayerType = {
  id: string;
  list: Optional<TrackType, 'album'>[];
  currentlyPlaying: number;
  album?: Omit<
    AlbumType,
    | 'external_ids'
    | 'genres'
    | 'label'
    | 'popularity'
    | 'tracks'
    | 'copyrights'
    | 'available_markets'
    | 'album_group'
  >;
};

interface Context {
  player: PlayerType | null;
  isPlaying: boolean;
  startPlayer: (
    args: {
      trackIndex?: number;
      album?: Omit<
        AlbumType,
        | 'external_ids'
        | 'genres'
        | 'label'
        | 'popularity'
        | 'tracks'
        | 'copyrights'
        | 'available_markets'
        | 'album_group'
      >;
    } & (
      | {
          argumentType: 'data';
          data:
            | PlaylistWithNoTracksType
            | PlaylistType
            | AlbumType
            | ArtistType
            | TrackType;
          tracks?: Optional<TrackType, 'album'>[];
        }
      | { argumentType: 'id'; id: string; tracks: Optional<TrackType, 'album'>[] }
    )
  ) => void;
  playPreviousTrack: () => void;
  playNextTrack: () => void;
  togglePlaying: () => void;
  stopPlaying: () => void;
  updateTrackList: (list: Optional<TrackType, 'album'>[]) => void;
}

const initial: Context = {
  player: null,
  isPlaying: false,
  startPlayer: () => {},
  playPreviousTrack: () => {},
  playNextTrack: () => {},
  togglePlaying: () => {},
  stopPlaying: () => {},
  updateTrackList: () => {},
};

export const PlayerContext = createContext(initial);

let startPlayerAbortController = new AbortController();

export function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useLocalStorageState('player', initial.player);
  const [isPlaying, setIsPlaying] = useState(initial.isPlaying);

  const getTrackListIndex = (
    list: TrackType[] | Omit<TrackType, 'album'>[],
    trackIndex: number | undefined
  ) => {
    return trackIndex === undefined
      ? list.findIndex((track) => track.preview_url)
      : trackIndex;
  };

  const startPlayer: Context['startPlayer'] = useCallback(
    (args) => {
      startPlayerAbortController.abort();
      startPlayerAbortController = new AbortController();

      const accessToken = getCookie('access_token') as string;
      const trackListId =
        args.argumentType === 'id' ? args.id : getPlayerId(args.data);

      if (player?.id === trackListId) {
        const { trackIndex, album } = args;

        if (trackIndex !== undefined && trackIndex !== player.currentlyPlaying) {
          setPlayer((state) =>
            state ? { ...state, currentlyPlaying: trackIndex, album } : null
          );
          setIsPlaying(true);
        } else {
          setIsPlaying((state) => !state);
        }
      } else if (args.argumentType === 'id') {
        const { id, tracks, trackIndex, album } = args;

        const currentlyPlaying = getTrackListIndex(tracks, trackIndex);

        if (currentlyPlaying !== -1) {
          setPlayer({
            list: tracks,
            id,
            currentlyPlaying,
            album,
          });
          setIsPlaying(true);
        }
      } else {
        const { data, tracks, trackIndex, album } = args;

        if (tracks !== undefined) {
          const currentlyPlaying = getTrackListIndex(tracks, trackIndex);

          if (currentlyPlaying !== -1) {
            setPlayer({
              list: tracks,
              id: trackListId,
              currentlyPlaying,
              album,
            });
            setIsPlaying(true);
          }
        } else if (data.type === 'playlist') {
          fetchPlaylist(accessToken, data.id, {
            signal: startPlayerAbortController.signal,
          }).then((data) => {
            if (!data) return;

            const list = data.tracks.items.map((item) => item.track);

            const currentlyPlaying = getTrackListIndex(list, trackIndex);

            if (currentlyPlaying !== -1) {
              setPlayer({
                list: list,
                id: trackListId,
                currentlyPlaying,
                album,
              });
              setIsPlaying(true);
            }
          });
        } else if (data.type === 'album') {
          if (data.tracks?.items) {
            const currentlyPlaying = getTrackListIndex(
              data.tracks.items,
              trackIndex
            );

            if (currentlyPlaying !== -1) {
              setPlayer({
                list: data.tracks.items,
                id: trackListId,
                album: album,
                currentlyPlaying,
              });
              setIsPlaying(true);
            }
          } else {
            fetchAlbum(accessToken, data.id, {
              signal: startPlayerAbortController.signal,
            }).then((data) => {
              if (!data) return;

              const currentlyPlaying = getTrackListIndex(
                data.tracks.items,
                trackIndex
              );

              if (currentlyPlaying !== -1) {
                setPlayer({
                  list: data.tracks.items,
                  id: trackListId,
                  album: album,
                  currentlyPlaying,
                });
                setIsPlaying(true);
              }
            });
          }
        } else if (data.type === 'artist') {
          fetchArtistTopTracks(accessToken, data.id, {
            signal: startPlayerAbortController.signal,
          }).then((data) => {
            if (!data) return;

            const currentlyPlaying = getTrackListIndex(data.tracks, trackIndex);

            if (currentlyPlaying !== -1) {
              setPlayer({
                list: data.tracks,
                id: trackListId,
                album: album,
                currentlyPlaying,
              });
              setIsPlaying(true);
            }
          });
        } else if (data.type === 'track') {
          setPlayer({
            list: [data],
            id: trackListId,
            album: album,
            currentlyPlaying: 0,
          });
          setIsPlaying(true);
        }
      }
    },
    [player?.id, player?.currentlyPlaying, setPlayer]
  );

  const playPreviousTrack: Context['playPreviousTrack'] = useCallback(() => {
    setPlayer((state) => {
      if (state === null) return null;

      let previousTrack = -1;
      for (let i = state.currentlyPlaying - 1; i >= 0; i--) {
        if (state.list[i].preview_url) {
          previousTrack = i;
          break;
        }
      }

      return {
        ...state,
        currentlyPlaying:
          previousTrack === -1 ? state.currentlyPlaying : previousTrack,
      };
    });
  }, [setPlayer]);

  const playNextTrack: Context['playNextTrack'] = useCallback(() => {
    setPlayer((state) => {
      if (state === null) return null;

      let nextTrackIndex = state.list
        .slice(state.currentlyPlaying + 1)
        .findIndex((track) => track.preview_url);

      if (nextTrackIndex === -1) {
        return {
          ...state,
          currentlyPlaying: state.list.findIndex((track) => track.preview_url),
        };
      } else {
        nextTrackIndex += state.currentlyPlaying + 1;
      }

      return {
        ...state,
        currentlyPlaying: nextTrackIndex,
      };
    });
    setIsPlaying(true);
  }, [setPlayer]);

  const togglePlaying: Context['togglePlaying'] = useCallback(() => {
    setIsPlaying((state) => !state);
  }, []);

  const stopPlaying: Context['stopPlaying'] = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const updateTrackList: Context['updateTrackList'] = useCallback(
    (list) => {
      setPlayer((state) =>
        state
          ? {
              ...state,
              list,
              currentlyPlaying: Math.min(state.currentlyPlaying, list.length - 1),
            }
          : null
      );
    },
    [setPlayer]
  );

  return (
    <PlayerContext.Provider
      value={{
        player,
        isPlaying,
        startPlayer,
        playPreviousTrack,
        playNextTrack,
        stopPlaying,
        updateTrackList,
        togglePlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

'use client';
import { createContext, useState, useCallback, useEffect } from 'react';
import { Optional } from '@/types';
import { AlbumType, TrackType } from '@/services/spotify';
import { useLocalStorageState } from '@/hooks';

export type PlayerTrackType = {
  typeAndId: string;
  list: Optional<TrackType, 'album'>[];
  currentlyPlaying: number;
  listAlbum?: Omit<
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
  playerTrack: PlayerTrackType | null;
  isPlaying: boolean;
  playTrack: (track: Optional<PlayerTrackType, 'currentlyPlaying'>) => void;
  playPreviousTrack: () => void;
  playNextTrack: () => void;
  togglePlaying: () => void;
  stopPlaying: () => void;
}

const initial: Context = {
  playerTrack: null,
  isPlaying: false,
  playTrack: () => {},
  playPreviousTrack: () => {},
  playNextTrack: () => {},
  togglePlaying: () => {},
  stopPlaying: () => {},
};

export const PlayerContext = createContext(initial);

export function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [playerTrack, setPlayerTrack] = useLocalStorageState(
    'player-tracks',
    initial.playerTrack
  );
  const [isPlaying, setIsPlaying] = useState(initial.isPlaying);

  const playTrack: Context['playTrack'] = useCallback(
    (playerTrackArg) => {
      setPlayerTrack((state) => {
        if (
          state?.typeAndId === playerTrackArg.typeAndId &&
          !playerTrackArg.currentlyPlaying
        ) {
          setIsPlaying(!isPlaying);
          return {
            ...playerTrackArg,
            currentlyPlaying: state.currentlyPlaying,
          };
        }

        setIsPlaying(true);
        return {
          ...playerTrackArg,
          currentlyPlaying: playerTrackArg.currentlyPlaying || 0,
        };
      });
    },
    [setPlayerTrack, isPlaying]
  );

  const playPreviousTrack: Context['playPreviousTrack'] = useCallback(() => {
    setPlayerTrack((state) => {
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
        currentlyPlaying: previousTrack === -1 ? state.currentlyPlaying : previousTrack,
      };
    });
  }, [setPlayerTrack]);

  const playNextTrack: Context['playNextTrack'] = useCallback(() => {
    setPlayerTrack((state) => {
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
  }, [setPlayerTrack]);

  const togglePlaying: Context['togglePlaying'] = useCallback(() => {
    setIsPlaying((state) => !state);
  }, []);

  const stopPlaying: Context['stopPlaying'] = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    console.log(playerTrack);
  }, [playerTrack]);

  return (
    <PlayerContext.Provider
      value={{
        playerTrack,
        isPlaying,
        playTrack,
        playPreviousTrack,
        playNextTrack,
        stopPlaying,
        togglePlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

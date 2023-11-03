'use client';
import { createContext, useState, useCallback, useEffect } from 'react';
import { Optional } from '@/types';
import { AlbumType, TrackType } from '@/services/spotify';
import { useLocalStorageState } from '@/hooks';

export type PlayerTrackType = {
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
  playerTrack: PlayerTrackType;
  isPlaying: boolean;
  playTrack: (track: PlayerTrackType) => void;
  playPreviousTrack: () => void;
  playNextTrack: () => void;
  togglePlaying: () => void;
  stopPlaying: () => void;
}

const initial: Context = {
  playerTrack: { list: [], currentlyPlaying: 0 },
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
      setPlayerTrack(playerTrackArg);
      setIsPlaying(true);
    },
    [setPlayerTrack]
  );

  const playPreviousTrack: Context['playPreviousTrack'] = useCallback(() => {
    setPlayerTrack((state) => ({
      ...state,
      currentlyPlaying: Math.max(state.currentlyPlaying - 1, 0),
    }));
  }, [setPlayerTrack]);

  const playNextTrack: Context['playNextTrack'] = useCallback(() => {
    setPlayerTrack((state) => ({
      ...state,
      currentlyPlaying:
        state.currentlyPlaying === state.list.length - 1
          ? 0
          : state.currentlyPlaying + 1,
    }));
    setIsPlaying(true);
  }, [setPlayerTrack]);

  const togglePlaying: Context['togglePlaying'] = useCallback(() => {
    setIsPlaying((state) => !state);
  }, []);

  const stopPlaying: Context['stopPlaying'] = useCallback(() => {
    setIsPlaying(false);
  }, []);

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

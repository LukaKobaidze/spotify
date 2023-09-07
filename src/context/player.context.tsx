'use client';
import { useLocalStorageState } from '@/hooks';
import { TrackType } from '@/types';
import { createContext, useState, useCallback } from 'react';

interface Context {
  track: TrackType | null;
  isPlaying: boolean;
  playTrack: (track: TrackType) => void;
  togglePlaying: () => void;
  stopPlaying: () => void;
}

const initial: Context = {
  track: null,
  isPlaying: false,
  playTrack: () => {},
  togglePlaying: () => {},
  stopPlaying: () => {},
};

export const PlayerContext = createContext(initial);

export function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useLocalStorageState('player-track', initial.track);
  const [isPlaying, setIsPlaying] = useState(initial.isPlaying);

  const playTrack: Context['playTrack'] = useCallback((trackArg) => {
    setTrack(trackArg);
    setIsPlaying(true);
  }, [setTrack]);

  const togglePlaying: Context['togglePlaying'] = useCallback(() => {
    setIsPlaying((state) => !state);
  }, []);

  const stopPlaying: Context['stopPlaying'] = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{ track, isPlaying, playTrack, stopPlaying, togglePlaying }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

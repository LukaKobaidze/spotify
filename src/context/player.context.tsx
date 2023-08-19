'use client';
import { createContext, useState, useCallback } from 'react';

interface Context {
  track: any;
  isPlaying: boolean;
  playTrack: (track?: any) => void;
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
  const [track, setTrack] = useState(initial.track);
  const [isPlaying, setIsPlaying] = useState(initial.isPlaying);

  const playTrack: Context['playTrack'] = useCallback((trackArg) => {
    setTrack(trackArg);
    setIsPlaying(true);
  }, []);

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

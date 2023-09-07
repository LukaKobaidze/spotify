'use client';
import { createContext } from 'react';
import { useLocalStorageState } from '@/hooks';

interface Context {
  liked: string[];
  onSaveToLiked: (trackId: string) => void;
}

const initial: Context = {
  liked: [],
  onSaveToLiked: () => {},
};

export const LibraryContext = createContext(initial);

export function LibraryContextProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useLocalStorageState('liked-songs', initial.liked);

  /** Save track to 'Liked Songs'. If track is already saved, It'll be removed. */
  const onSaveToLiked: Context['onSaveToLiked'] = (trackId) => {
    setLiked((state) => {
      const index = state.indexOf(trackId);

      if (index === -1) {
        return [...state, trackId];
      }

      return [...state.slice(0, index), ...state.slice(index + 1)];
    });
  };

  return (
    <LibraryContext.Provider value={{ liked, onSaveToLiked }}>
      {children}
    </LibraryContext.Provider>
  );
}

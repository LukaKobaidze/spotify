import { createContext, useState } from 'react';

interface Context {
  track: any;
  playTrack: (track: any) => void;
}

const initial: Context = {
  track: null,
  playTrack: () => {},
};

export const PlayerContext = createContext(initial);

export function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState(initial.track);

  const playTrack: Context['playTrack'] = (track) => {
    setTrack(track);
  };

  return (
    <PlayerContext.Provider value={{ track, playTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

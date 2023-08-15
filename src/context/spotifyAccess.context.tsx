'use client';
import { createContext, useEffect, useState } from 'react';

export const SpotifyAccessContext = createContext<{ token: string }>({
  token: '',
});

export function SpotifyAccessProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');

  useEffect(() => {
    fetch('/api/spotify-access')
      .then((res) => res.json())
      .then((data) => setToken(data['access_token']));
  }, []);

  return (
    <SpotifyAccessContext.Provider value={{ token }}>
      {children}
    </SpotifyAccessContext.Provider>
  );
}

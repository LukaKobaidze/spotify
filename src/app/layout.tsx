import Sidebar from '@/components/Sidebar';
import './globals.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpotifyAccessProvider } from '@/context/spotifyAccess.context';
import Player from '@/components/Player';
import { PlayerContextProvider } from '@/context/player.context';
import { LibraryContextProvider } from '@/context/library.context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SpotifyAccessProvider>
      <PlayerContextProvider>
        <LibraryContextProvider>
          <html lang="en">
            <body className={inter.className}>
              <Sidebar className="sidebar" />
              <div className="roundedContainer mainContentContainer">{children}</div>
              <Player className="player" />
            </body>
          </html>
        </LibraryContextProvider>
      </PlayerContextProvider>
    </SpotifyAccessProvider>
  );
}

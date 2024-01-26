import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PlayerContextProvider } from '@/context/player.context';
import { LibraryContextProvider } from '@/context/library.context';
import { LayoutContextProvider } from '@/context/layout.context';
import { cookies } from 'next/headers';
import { MenuContextProvider } from '@/context/menu.context';
import VerifyAuth from '@/components/VerifyAuth';
import Sidebar from '@/components/Sidebar';
import MainView from '@/components/MainView';
import Player from '@/components/Player';
import './globals.scss';
import FooterMobile from '@/components/NavigationMobile';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Clone | Next.js v13+',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  return (
    <MenuContextProvider>
      <PlayerContextProvider>
        <LibraryContextProvider>
          <LayoutContextProvider>
            <html lang="en">
              <body className={inter.className}>
                <VerifyAuth accessToken={accessToken} />

                <Sidebar className="sidebar" />
                <MainView>{children}</MainView>
                <footer className="footer">
                  <Player />
                  <FooterMobile className="navigationMobile" />
                </footer>
              </body>
            </html>
          </LayoutContextProvider>
        </LibraryContextProvider>
      </PlayerContextProvider>
    </MenuContextProvider>
  );
}

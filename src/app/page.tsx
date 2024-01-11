import { cookies } from 'next/headers';
import { fetchFeaturedPlaylists, fetchPlaylist } from '@/services/spotify';
import data from '@/data';
import Header from '@/components/Header';
import SpotifyPlaylists from './SpotifyPlaylists';
import FeaturedPlaylists from './FeaturedPlaylists';
import GlobalTop50 from './GlobalTop50';
import styles from './page.module.scss';

export default async function RootPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const spotifyPlaylistsData = accessToken
    ? await Promise.all(
        data.homePage.spotifyPlaylists.map(async (playlistId) => {
          return await fetchPlaylist(accessToken, playlistId);
        })
      )
    : [];

  const featuredPlaylistsData = accessToken
    ? await fetchFeaturedPlaylists(accessToken, 7)
    : null;
  const globalTop50Data = accessToken
    ? await fetchPlaylist(accessToken, data.homePage.playlistGlobalTop50)
    : null;

  return (
    <>
      <Header />
      <main>
        <SpotifyPlaylists
          data={spotifyPlaylistsData}
          accessToken={accessToken}
          className={styles.rowFirst}
        />
        {globalTop50Data && (
          <GlobalTop50 data={globalTop50Data} className={styles.globalTop50} />
        )}
        {featuredPlaylistsData && (
          <FeaturedPlaylists
            data={featuredPlaylistsData}
            accessToken={accessToken}
            className={styles.row}
          />
        )}
      </main>
    </>
  );
}

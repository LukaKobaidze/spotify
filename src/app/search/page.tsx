'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { SearchDataType, fetchSearch } from '@/helpers/requests';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import Header from '@/components/Header';
import Searchbar from '@/components/Searchbar';
import Songs from '@/components/Songs';
import Playlist from '@/components/Playlist';
import Card from '@/components/Card';
import styles from './page.module.scss';

let timeout: NodeJS.Timeout;
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useContext(SpotifyAccessContext);
  const [searchInput, setSearchInput] = useState(searchParams.get('value') || '');
  const [searchResult, setSearchResult] = useState<SearchDataType | null>(null);

  const handleSearchbarSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearTimeout(timeout);
    router.replace(`/search?value=${searchInput}`);
  };

  useEffect(() => {
    if (searchInput.trim().length === 0) {
      router.replace('/search');
    } else {
      timeout = setTimeout(() => {
        router.replace(`/search?value=${searchInput}`);
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [router, searchInput]);

  const search = searchParams.get('value');
  useEffect(() => {
    if (!search) {
      setSearchResult(null);
    } else {
      fetchSearch(token, search, 6).then((data) => setSearchResult(data));
    }
  }, [search, token]);

  const topResult = searchResult?.artists?.items[0];
  console.log(searchResult);
  return (
    <>
      <Header>
        <Searchbar
          classNameContainer={styles.searchbarContainer}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFormSubmit={handleSearchbarSubmit}
          onClear={() => setSearchInput('')}
        />
      </Header>
      <main>
        <div className={styles.top}>
          {topResult && (
            <div className={styles.topResult}>
              <h2 className={styles.topHeading}>Top result</h2>

              <Playlist>
                <Link
                  href={'artist/' + topResult.id}
                  className={styles.topResultAnchor}
                >
                  <Image
                    src={topResult.images[1].url}
                    width={topResult.images[1].height}
                    height={topResult.images[1].height}
                    alt=""
                    className={styles.topResultAnchorImage}
                  />
                  <span className={styles.topResultAnchorName}>
                    {topResult.name}
                  </span>
                  <span className={styles.topResultAnchorTag}>Artist</span>
                </Link>
              </Playlist>
            </div>
          )}

          {searchResult?.tracks?.items && searchResult.tracks.items.length && (
            <div className={styles.songs}>
              <h2 className={styles.topHeading}>Songs</h2>
              <Songs
                data={searchResult?.tracks?.items?.slice(0, 4) || []}
                hideHeaderLabels
                hideIndexing
              />
            </div>
          )}
        </div>
        {searchResult?.albums?.items && searchResult.albums.items.length && (
          <div className={styles.row}>
            <h2 className={styles.rowHeading}>Albums</h2>
            <div className={styles.rowItems}>
              {searchResult.albums.items.map((album) => (
                <Playlist key={album.id} playerOffset={[24, 97]}>
                  <Link href={'/album/' + album.id}>
                    <Card
                      image={{
                        src: album.images[1].url,
                        width: album.images[1].width,
                        height: album.images[1].height,
                      }}
                      title={album.name}
                      subtitle={
                        album.release_date.slice(
                          0,
                          album.release_date.indexOf('-')
                        ) +
                        ' • ' +
                        album.artists[0].name
                      }
                    />
                  </Link>
                </Playlist>
              ))}
            </div>
          </div>
        )}

        {searchResult?.playlists?.items?.length && (
          <div className={styles.row}>
            <h2 className={styles.rowHeading}>Playlists</h2>
            <div className={styles.rowItems}>
              {searchResult.playlists.items.map((playlist) => (
                <Playlist key={playlist.id} playerOffset={[24, 97]}>
                  <Link href={'/playlist/' + playlist.id}>
                    <Card
                      image={{
                        src: playlist.images[0].url,
                        width: playlist.images[0].height,
                        height: playlist.images[0].height,
                      }}
                      title={playlist.name}
                      subtitle={'By ' + playlist.owner.display_name}
                    />
                  </Link>
                </Playlist>
              ))}
            </div>
          </div>
        )}

        {searchResult?.artists.items.length && (
          <div className={styles.row}>
            <h2 className={styles.rowHeading}>Artists</h2>
            <div className={styles.rowItems}>
              {searchResult.artists.items.map((artist) => (
                <Playlist key={artist.id} playerOffset={[24, 97]}>
                  <Link href={'/artist/' + artist.id}>
                    <Card
                      image={{
                        src: artist.images[0]?.url,
                        width: artist.images[0]?.width,
                        height: artist.images[0]?.height,
                      }}
                      title={artist.name}
                      subtitle="Artist"
                      imageRounded
                    />
                  </Link>
                </Playlist>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

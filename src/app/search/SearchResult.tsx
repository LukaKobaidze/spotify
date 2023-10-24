'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '@/context/layout.context';
import { SearchDataType } from '@/helpers/requests';
import Playlist from '@/components/ItemPlayer/ItemPlayer';
import Songs from '@/components/Songs/Songs';
import Card from '@/components/Card/Card';
import styles from './SearchResult.module.scss';

interface Props {
  data: SearchDataType;
}

export default function SearchResult(props: Props) {
  const { data } = props;

  const { sidebarSize } = useContext(LayoutContext);
  const [mainViewWidth, setMainViewWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMainViewWidth = () => {
      setMainViewWidth(containerRef.current?.clientWidth || 0);
    };

    handleMainViewWidth();
    window.addEventListener('resize', handleMainViewWidth);

    return () => {
      window.removeEventListener('resize', handleMainViewWidth);
    };
  }, [sidebarSize]);

  const itemRowLimit = Math.floor(mainViewWidth / 180);
  const topResult = data.artists?.items[0];

  return (
    <div ref={containerRef}>
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
                <span className={styles.topResultAnchorName}>{topResult.name}</span>
                <span className={styles.topResultAnchorTag}>Artist</span>
              </Link>
            </Playlist>
          </div>
        )}

        {data.tracks?.items && data.tracks.items.length && (
          <div className={styles.songs}>
            <h2 className={styles.topHeading}>Songs</h2>
            <Songs
              data={data.tracks?.items?.slice(0, 4) || []}
              hideHeaderLabels
              hideIndexing
              disableBodyGap
              hideAlbumColumn
            />
          </div>
        )}
      </div>
      {data.albums?.items && data.albums.items.length && (
        <div className={`${styles.row} ${styles.albumsRow}`}>
          <h2 className={styles.rowHeading}>Albums</h2>
          <div className={styles.rowItems}>
            {data.albums.items.slice(0, itemRowLimit).map((album) => (
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
                      album.release_date.slice(0, album.release_date.indexOf('-')) +
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

      {data.playlists?.items?.length && (
        <div className={styles.row}>
          <h2 className={styles.rowHeading}>Playlists</h2>
          <div className={styles.rowItems}>
            {data.playlists.items.slice(0, itemRowLimit).map((playlist) => (
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

      {data.artists.items.length && (
        <div className={styles.row}>
          <h2 className={styles.rowHeading}>Artists</h2>
          <div className={styles.rowItems}>
            {data.artists.items.slice(0, itemRowLimit).map((artist) => (
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
    </div>
  );
}

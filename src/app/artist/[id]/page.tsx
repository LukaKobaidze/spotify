'use client';
import { useContext, useEffect, useState } from 'react';
import {
  fetchArtist,
  fetchArtistAlbums,
  fetchArtistRelatedArtists,
  fetchArtistTopTracks,
} from '@/helpers/requests';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import styles from './page.module.scss';
import Header from '@/components/Header';
import Image from 'next/image';
import PlayButton from '@/components/PlayButton';
import Songs from '@/components/Songs';
import Playlist from '@/components/Playlist';
import Link from 'next/link';
import Card from '@/components/Card';

interface Props {
  params: {
    id: string;
  };
}

export default function ArtistPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);

  const [artistData, setArtistData] = useState<any>(null);
  const [popularSongs, setPopularSongs] = useState<any>();
  const [popularSongsSeeMore, setPopularSongsSeeMore] = useState(false);
  const [albums, setAlbums] = useState<any>();
  const [relatedArtists, setRelatedArtists] = useState<any>();

  useEffect(() => {
    fetchArtist(token, params.id).then((resData) => setArtistData(resData));
    fetchArtistTopTracks(token, params.id).then((resData) =>
      setPopularSongs(resData.tracks)
    );
    fetchArtistAlbums(token, params.id).then((resData) => setAlbums(resData));
    fetchArtistRelatedArtists(token, params.id).then((resData) =>
      setRelatedArtists(resData.artists)
    );
  }, [token, params.id]);

  console.log(relatedArtists);

  return (
    <>
      <Header />
      <main>
        {artistData && (
          <div className={styles.banner}>
            <div>
              <h1 className={styles.bannerHeading}>{artistData.name}</h1>
              <p className={styles.bannerFollowers}>
                {artistData.followers.total.toLocaleString()} followers
              </p>
            </div>

            {artistData.images && (
              <Image
                src={artistData.images[1].url}
                width={artistData.images[1].width}
                height={artistData.images[1].height}
                alt=""
                className={styles.bannerImage}
              />
            )}
          </div>
        )}

        {popularSongs && (
          <>
            <div className={styles.actions}>
              <PlayButton className={styles.playButton} />
            </div>

            <div className={styles.popularSongs}>
              <h2>Popular</h2>
              <Songs
                data={popularSongsSeeMore ? popularSongs : popularSongs.slice(0, 5)}
                hideHeaderLabels
              />
              <button onClick={() => setPopularSongsSeeMore((state) => !state)}>
                {popularSongsSeeMore ? 'Show less' : 'See more'}
              </button>
            </div>
          </>
        )}

        {albums && (
          <div className={styles.row}>
            <div className={styles.rowHeader}>
              <h2 className={styles.rowHeading}>Albums</h2>
              <Link href={`${params.id}/albums`} className={styles.rowShowAll}>
                Show all
              </Link>
            </div>
            <div className={styles.rowItems}>
              {albums.items.slice(0, 6).map((album: any) => (
                <Playlist
                  key={album.id}
                  playerOffset={[24, 97]}
                  classNameWrapper={styles.rowItemsItem}
                >
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

        {relatedArtists && (
          <div className={styles.row}>
            <div className={styles.rowHeader}>
              <h2 className={styles.rowHeading}>Fans also like</h2>
              <Link href={`${params.id}/related`} className={styles.rowShowAll}>
                Show all
              </Link>
            </div>
            <div className={styles.rowItems}>
              {relatedArtists.slice(0, 6).map((album: any) => (
                <Playlist
                  key={album.id}
                  playerOffset={[24, 97]}
                  classNameWrapper={styles.rowItemsItem}
                >
                  <Link href={'/album/' + album.id}>
                    <Card
                      image={{
                        src: album.images[1].url,
                        width: album.images[1].width,
                        height: album.images[1].height,
                      }}
                      title={album.name}
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

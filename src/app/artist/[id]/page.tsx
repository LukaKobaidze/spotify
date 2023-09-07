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
import { AlbumType, ArtistType, DataType, TrackType } from '@/types';

interface Props {
  params: {
    id: string;
  };
}

export default function ArtistPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);

  const [artistData, setArtistData] = useState<ArtistType | null>(null);
  const [popularSongs, setPopularSongs] = useState<TrackType[]>();
  const [popularSongsSeeMore, setPopularSongsSeeMore] = useState(false);
  const [albums, setAlbums] = useState<DataType<AlbumType>>();
  const [relatedArtists, setRelatedArtists] = useState<ArtistType[]>();

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
      <Header className={styles.header} />
      <main>
        <div className={styles.bannerBackground} />
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

            <div>
              <div className={styles.rowHeader}>
                <h2>Popular</h2>
              </div>
              <Songs
                data={popularSongsSeeMore ? popularSongs : popularSongs.slice(0, 5)}
                hideHeaderLabels
              />
              <button
                className={styles.popularSongsSeeMoreButton}
                onClick={() => setPopularSongsSeeMore((state) => !state)}
              >
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
              {albums.items.slice(0, 6).map((album) => (
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
              {relatedArtists.slice(0, 6).map((artist) => (
                <Playlist
                  key={artist.id}
                  playerOffset={[24, 97]}
                  classNameWrapper={styles.rowItemsItem}
                >
                  <Link href={'/album/' + artist.id}>
                    <Card
                      image={{
                        src: artist.images[1].url,
                        width: artist.images[1].width,
                        height: artist.images[1].height,
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

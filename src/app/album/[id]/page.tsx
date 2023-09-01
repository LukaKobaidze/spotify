'use client';
import Header from '@/components/Header';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import { fetchAlbum, fetchArtist } from '@/helpers/requests';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import PlayButton from '@/components/PlayButton';
import Tooltip from '@/components/Tooltip';
import { IconHeart } from '@/icons';
import Songs from '@/components/Songs';

interface Props {
  params: {
    id: string;
  };
}

export default function AlbumPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);
  const [albumData, setAlbumData] = useState<any>();
  const [artistData, setArtistData] = useState<any>();

  useEffect(() => {
    fetchAlbum(token, params.id).then((data) => setAlbumData(data));
  }, [params.id, token]);

  useEffect(() => {
    if (albumData) {
      fetchArtist(token, albumData.artists[0].id).then((data) =>
        setArtistData(data)
      );
    }
  }, [albumData, token]);

  console.log({ albumData, artistData });

  const image = albumData?.images[1];
  const artistImage = artistData?.images[2];
  return (
    <>
      <Header />
      <main>
        <div className={styles.top}>
          {albumData && (
            <>
              <Image
                alt=""
                src={image.url}
                width={image.width}
                height={image.height}
              />
              <div>
                <span>Album</span>
                <h1>{albumData.name}</h1>
                <div>
                  {artistImage && (
                    <>
                      <Image
                        src={artistImage.url}
                        width={artistImage.width}
                        height={artistImage.height}
                        alt=""
                      />
                      <span>{artistData.name}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <PlayButton />
          <Tooltip text="Save to Your Library" position="top" showOnHover>
            <button>
              <IconHeart />
            </button>
          </Tooltip>
        </div>
        {albumData?.tracks?.items.length && (
          <Songs data={albumData.tracks.items} album={albumData} hideAlbum />
        )}
      </main>
    </>
  );
}

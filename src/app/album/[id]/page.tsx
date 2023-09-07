'use client';
import Header from '@/components/Header';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import { fetchAlbum, fetchArtist } from '@/helpers/requests';
import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import PlayButton from '@/components/PlayButton';
import Tooltip from '@/components/Tooltip';
import { IconHeart } from '@/icons';
import Songs from '@/components/Songs';
import PlaylistHeader from '@/components/PlaylistHeader';
import { AlbumType, ArtistType } from '@/types';
import { msToTime } from '@/helpers/time';

interface Props {
  params: {
    id: string;
  };
}

export default function AlbumPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);
  const [albumData, setAlbumData] = useState<AlbumType>();
  const [artistData, setArtistData] = useState<ArtistType>();

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

  const albumDuration = useMemo(() => {
    if (!albumData) return null;

    const [min, sec] = msToTime(
      albumData.tracks.items.reduce((acc, track) => acc + track.duration_ms, 0)
    ).split(':');

    return `${min} min ${sec} sec`;
  }, [albumData]);

  return (
    <>
      <Header />
      <main>
        {albumData && artistData && (
          <PlaylistHeader
            image={albumData.images[1]}
            title={albumData.name}
            type="Album"
            artist={artistData}
            subtitle={
              <>
                &nbsp;•&nbsp;
                <Tooltip
                  text={new Date(albumData.release_date).toLocaleDateString(
                    'en-us',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                  position="top"
                  showOnHover
                >
                  <span>
                    {albumData.release_date.slice(
                      0,
                      albumData.release_date.indexOf('-')
                    )}
                  </span>
                </Tooltip>
                &nbsp;•&nbsp;
                <span>{albumData.tracks.items.length} songs,</span>
                <span className={styles.albumDuration}>&nbsp;{albumDuration}</span>
              </>
            }
          />
        )}
        <div className={styles.actions}>
          <PlayButton variant="large" className={styles.playButton} />
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

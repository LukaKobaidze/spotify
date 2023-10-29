'use client';
import Header from '@/components/Header/Header';
import ItemHeader from '@/components/PlayerHeader/PlayerHeader';
import PlayButton from '@/components/PlayButton/PlayButton';
import Tracks from '@/components/Tracks';
import { LibraryContext } from '@/context/library.context';
import { TrackType, fetchSeveralTracks } from '@/services/spotify';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';

let abortController = new AbortController();

export default function LikedPage() {
  const { liked } = useContext(LibraryContext);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tracksData, setTracksData] = useState<TrackType[]>();

  useEffect(() => {
    fetch('/api/access-token')
      .then((res) => res.json())
      .then((data) => setAccessToken(data));
  }, []);

  useEffect(() => {
    abortController.abort();
    abortController = new AbortController();

    if (accessToken) {
      fetchSeveralTracks(accessToken, liked, abortController).then((data) => {
        setTracksData(data.flatMap((d) => d.tracks));
      });
    }
  }, [accessToken, liked]);

  useEffect(() => {
    setTracksData((state) => {
      if (!state || state.length < liked.length) return state;

      const copy = state.slice();

      copy.splice(
        copy.findIndex((song, i) => song.id !== liked[i]),
        1
      );

      return copy;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liked]);

  return (
    <>
      <Header />
      <main>
        <ItemHeader
          image={{
            url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png',
            width: 300,
            height: 300,
          }}
          title="Liked Songs"
          type="Playlist"
          subtitle={`${liked.length} songs`}
        />
        <div className={styles.playButtonWrapper}>
          <PlayButton variant="large" />
        </div>
        {tracksData && <Tracks data={tracksData} />}
      </main>
    </>
  );
}

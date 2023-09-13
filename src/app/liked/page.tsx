'use client';
import Header from '@/components/Header';
import ItemHeader from '@/components/ItemHeader';
import PlayButton from '@/components/PlayButton';
import Songs from '@/components/Songs';
import { LibraryContext } from '@/context/library.context';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import { fetchSeveralTracks } from '@/helpers/requests';
import { TrackType } from '@/types';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';

let abortController = new AbortController();
export default function LikedPage() {
  const { token } = useContext(SpotifyAccessContext);
  const { liked } = useContext(LibraryContext);

  const [songsData, setSongsData] = useState<TrackType[]>();

  useEffect(() => {
    abortController.abort();
    abortController = new AbortController();

    fetchSeveralTracks(token, liked, abortController).then((data) => {
      console.log(data);
      setSongsData(data.flatMap((d) => d.tracks));
    });
  }, [token, liked]);

  useEffect(() => {
    setSongsData((state) => {
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
        {songsData && <Songs data={songsData} />}
      </main>
    </>
  );
}

'use client';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { TrackType, fetchSeveralTracks } from '@/services/spotify';
import { LibraryContext } from '@/context/library.context';
import { PlayerContext } from '@/context/player.context';
import { IconSearch } from '@/icons';
import Header from '@/components/Header';
import PlayerHeader from '@/components/PlayerHeader';
import PlayButton from '@/components/PlayButton';
import Tracks from '@/components/Tracks';
import styles from './page.module.scss';

let abortController = new AbortController();

export default function LikedPage() {
  const { player, startPlayer, isPlaying } = useContext(PlayerContext);
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

  const localPlayerId = 'liked';

  return (
    <>
      <Header backgroundAppearOnScroll />
      <main>
        <PlayerHeader
          image={{
            url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png',
            width: 300,
            height: 300,
          }}
          title="Liked Songs"
          type="Playlist"
          subtitle={`${liked.length} songs`}
        />
        {player && tracksData?.length ? (
          <>
            <div className={styles.playButtonWrapper}>
              <PlayButton
                variant="large"
                onClick={() =>
                  startPlayer({
                    argumentType: 'id',
                    id: localPlayerId,
                    tracks: tracksData!,
                  })
                }
                isButtonPlaying={player.id === localPlayerId && isPlaying}
              />
            </div>
            <Tracks playerId={localPlayerId} data={tracksData!} />
          </>
        ) : !liked.length ? (
          <div className={styles.messageEmpty}>
            <p className={styles.messageEmptyText}>
              You currently have no liked songs.
            </p>
            <Link
              href="/search"
              className={`roundedContainer ${styles.messageEmptyLinkButton}`}
            >
              <IconSearch className={styles.messageEmptyLinkButtonIcon} />
              <span>Explore Songs</span>
            </Link>
          </div>
        ) : null}
      </main>
    </>
  );
}

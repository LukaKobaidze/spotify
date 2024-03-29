'use client';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { LibraryContext } from '@/context/library.context';
import { LayoutContext } from '@/context/layout.context';
import { PlayerContext } from '@/context/player.context';
import TrackTitle from '@/components/TrackTitle';
import LikeButton from '@/components/LikeButton';
import AudioPlayback from './AudioPlayback';
import Volume from './Volume';
import MobilePlayer from './MobilePlayer';
import AudioPlayButton from './AudioPlayButton';
import Controls from './Controls';
import styles from './Player.module.scss';

interface Props {
  className?: string;
}

export default function Player(props: Props) {
  const { className } = props;
  const { player, playNextTrack, isPlaying, stopPlaying } =
    useContext(PlayerContext);
  const pathname = usePathname();
  const { windowSize } = useContext(LayoutContext);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [extendMobilePlayer, setExtendMobilePlayer] = useState(false);

  const audio = useRef<HTMLAudioElement>(null);
  const { liked, onSaveToLiked } = useContext(LibraryContext);

  const track = player?.list[player.currentlyPlaying];
  const trackAlbum = player?.album || track?.album;

  const handleCurrentTimeUpdate = (currentTime: number) => {
    if (audio.current) {
      setCurrentTime(currentTime);
      audio.current.currentTime = currentTime;
    }
  };

  useEffect(() => {
    if (windowSize <= 575) {
      setExtendMobilePlayer(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (windowSize <= 575 && extendMobilePlayer) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [extendMobilePlayer, windowSize]);

  useEffect(() => {
    audio.current?.load();
  }, [player?.id, track?.preview_url]);

  useEffect(() => {
    if (!audio.current) return;

    let interval: NodeJS.Timer;

    if (isPlaying) {
      audio.current.play();

      setCurrentTime(audio.current?.currentTime || 0);
      setInterval(() => {
        setCurrentTime(audio.current?.currentTime || 0);
      }, 1000);
    } else {
      audio.current.pause();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, track]);

  return (
    <div className={`${styles.container} ${windowSize <= 575 && !player ? styles.hide : ''} ${className || ''}`}>
      {windowSize <= 575 && !extendMobilePlayer && (
        <div
          className={styles.mobileOnClickExtender}
          onClick={() => setExtendMobilePlayer(true)}
        />
      )}
      <audio
        ref={audio}
        onLoadedData={() => setTotalDuration(audio.current?.duration || 0)}
        onEnded={() => {
          setCurrentTime(audio.current?.duration || 0);
          stopPlaying();

          if (player!.list.length - 1 !== player!.currentlyPlaying) {
            playNextTrack();
          }
        }}
        preload="true"
      >
        <source src={track?.preview_url} />
      </audio>

      <div className={styles.left}>
        {track && trackAlbum && (
          <>
            <TrackTitle
              trackName={track.name}
              trackId={track.id}
              artistName={track.artists[0].name}
              artistId={track.artists[0].id}
              image={{
                src: trackAlbum.images[trackAlbum.images.length - 1].url,
                size: 56,
              }}
              className={styles.trackTitle}
              classNameText={styles.trackTitleText}
              classNameImage={styles.trackImage}
              classNameTrack={styles.trackName}
              classNameArtist={styles.trackArtist}
            />
            <LikeButton
              active={liked.includes(track.id)}
              onClick={() => onSaveToLiked(track.id)}
              className={styles.likeButton}
            />
          </>
        )}
      </div>

      {windowSize > 575 && (
        <div className={styles.middle}>
          <Controls onResetCurrentTime={() => handleCurrentTimeUpdate(0)} />

          <AudioPlayback
            audioDuration={totalDuration}
            currentTime={currentTime}
            onCurrentTimeUpdate={handleCurrentTimeUpdate}
          />
        </div>
      )}

      {windowSize > 575 && (
        <Volume
          className={styles.volume}
          windowSize={windowSize}
          onVolumeChange={(volume) => {
            if (audio.current) {
              audio.current.volume = Math.min(volume / 100, 1);
            }
          }}
          onMuteToggle={(muted) => {
            if (audio.current) {
              audio.current.muted = muted;
            }
          }}
        />
      )}

      {windowSize <= 575 && (
        <>
          <AudioPlayButton className={styles.playButtonMobile} />
          <div
            className={styles.audioProgressMobile}
            style={{
              transform: `scaleX(${
                Math.floor(currentTime) / Math.floor(totalDuration)
              })`,
            }}
          />

          {extendMobilePlayer && (
            <MobilePlayer
              currentTime={currentTime}
              totalDuration={totalDuration}
              onCurrentTimeUpdate={handleCurrentTimeUpdate}
              onClose={() => setExtendMobilePlayer(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

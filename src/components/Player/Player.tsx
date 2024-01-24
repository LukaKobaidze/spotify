'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { LibraryContext } from '@/context/library.context';
import { LayoutContext } from '@/context/layout.context';
import { PlayerContext } from '@/context/player.context';
import { IconPause, IconPlay, IconSkipNext, IconSkipPrevious } from '@/icons';
import TrackTitle from '@/components/TrackTitle';
import LikeButton from '@/components/LikeButton';
import Tooltip from '@/components/Tooltip';
import AudioPlayback from './AudioPlayback';
import Volume from './Volume';
import styles from './Player.module.scss';

interface Props {
  className?: string;
}

export default function Player(props: Props) {
  const { className } = props;
  const {
    player,
    playPreviousTrack,
    playNextTrack,
    isPlaying,
    stopPlaying,
    togglePlaying,
  } = useContext(PlayerContext);
  const { windowSize } = useContext(LayoutContext);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const audio = useRef<HTMLAudioElement>(null);
  const { liked, onSaveToLiked } = useContext(LibraryContext);

  const track = player?.list[player.currentlyPlaying];
  const trackAlbum = player?.album || track?.album;

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
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.left}>
        {track && trackAlbum && (
          <>
            <TrackTitle
              trackName={track.name}
              trackId={track.id}
              artistName={track.artists[0].name}
              artistId={track.artists[0].id}
              image={trackAlbum.images[1].url}
              imageSize={trackAlbum.images[1].height}
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

      <div className={styles.middle}>
        <div className={styles.middleTop}>
          <Tooltip text="Previous" position="top">
            <button
              className={styles.buttonSkip}
              onClick={() => {
                playPreviousTrack();
                if (audio.current) {
                  setCurrentTime(0);

                  audio.current.currentTime = 0;
                }
              }}
            >
              <IconSkipPrevious className={styles.buttonSkipIcon} />
            </button>
          </Tooltip>
          <Tooltip text="Play" position="top" offset={12}>
            <button className={styles.buttonPlay} onClick={() => togglePlaying()}>
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
          </Tooltip>
          <Tooltip text="Next" position="top">
            <button className={styles.buttonSkip} onClick={playNextTrack}>
              <IconSkipNext className={styles.buttonSkipIcon} />
            </button>
          </Tooltip>
        </div>

        <AudioPlayback
          ref={audio}
          audioSrc={track?.preview_url}
          audioDuration={totalDuration}
          onAudioEnded={() => {
            setCurrentTime(audio.current?.duration || 0);
            stopPlaying();

            if (player!.list.length - 1 !== player!.currentlyPlaying) {
              playNextTrack();
            }
          }}
          onAudioLoad={() => setTotalDuration(audio.current?.duration || 0)}
          currentTime={currentTime}
          onCurrentTimeUpdate={(currentTime) => {
            if (audio.current) {
              setCurrentTime(currentTime);
              audio.current.currentTime = currentTime;
            }
          }}
        />
      </div>

      <Volume
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
    </div>
  );
}

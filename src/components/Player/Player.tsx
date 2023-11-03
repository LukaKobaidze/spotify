'use client';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '@/context/player.context';
import {
  IconPause,
  IconPlay,
  IconSkipNext,
  IconSkipPrevious,
  IconVolumeHigh,
  IconVolumeLow,
  IconVolumeMute,
} from '@/icons';
import TrackTitle from '../TrackTitle/TrackTitle';
import styles from './Player.module.scss';
import Tooltip from '../Tooltip/Tooltip';
import { msToTime } from '@/helpers/time';
import { LibraryContext } from '@/context/library.context';
import LikeButton from '../LikeButton/LikeButton';

const VOLUME_DEFAULT = 50;

interface Props {
  className?: string;
}

export default function Player(props: Props) {
  const { className } = props;
  const {
    playerTrack,
    playPreviousTrack,
    playNextTrack,
    isPlaying,
    stopPlaying,
    togglePlaying,
  } = useContext(PlayerContext);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(VOLUME_DEFAULT);
  const [isMuted, setIsMuted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const { liked, onSaveToLiked } = useContext(LibraryContext);

  const track = playerTrack.list[playerTrack.currentlyPlaying];
  const trackAlbum = playerTrack.listAlbum || track?.album;

  useEffect(() => {
    audio.current?.load();
  }, [track?.preview_url]);

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

  useEffect(() => {
    if (!audio.current) return;

    audio.current.volume = volume / 100;

    if (volume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }, [volume]);

  useEffect(() => {
    if (!audio.current) return;

    if (isMuted) {
      audio.current.volume = 0;
    } else {
      if (volume === 0) {
        setVolume(VOLUME_DEFAULT);
        audio.current.volume = VOLUME_DEFAULT / 100;
      } else {
        audio.current.volume = volume / 100;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  const handlePlaybackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio.current) return;

    const updated = Number(e.target.value || 0);

    audio.current.currentTime = updated;
    setCurrentTime(updated);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value || 0));
  };

  const handleMuteClick = () => {
    setIsMuted((state) => !state);
  };

  const timerCurrent = useMemo(() => msToTime(currentTime * 1000), [currentTime]);

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
            <button className={styles.buttonSkip} onClick={playPreviousTrack}>
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
        <div className={styles.playback}>
          <audio
            ref={audio}
            onEnded={() => {
              setCurrentTime(audio.current?.duration || 0);
              stopPlaying();

              if (playerTrack.list.length - 1 !== playerTrack.currentlyPlaying) {
                playNextTrack();
              }
            }}
            preload="true"
          >
            <source src={track?.preview_url} />
          </audio>
          <span>{timerCurrent}</span>
          <input
            type="range"
            min={0}
            value={currentTime}
            max={Math.ceil(audio.current?.duration || 0)}
            onChange={handlePlaybackChange}
            className={styles.playbackRange}
          />
          <span>{msToTime((audio.current?.duration || 0) * 1000)}</span>
        </div>
      </div>

      <div className={styles.right}>
        <Tooltip text={isMuted ? 'Unmute' : 'Mute'} position="top">
          <button onClick={handleMuteClick}>
            {isMuted ? (
              <IconVolumeMute />
            ) : volume <= 50 ? (
              <IconVolumeLow />
            ) : (
              <IconVolumeHigh />
            )}
          </button>
        </Tooltip>

        <input
          type="range"
          min={0}
          value={isMuted ? 0 : volume}
          max={100}
          onChange={handleVolumeChange}
          className={styles.volumeRange}
        />
      </div>
    </div>
  );
}

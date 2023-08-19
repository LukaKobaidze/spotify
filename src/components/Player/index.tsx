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
import TrackTitle from '../TrackTitle';
import styles from './Player.module.scss';
import Tooltip from '../Tooltip';
import { msToTime } from '@/helpers/time';

const VOLUME_DEFAULT = 50;

interface Props {
  className?: string;
}

export default function Player(props: Props) {
  const { className } = props;
  const { track, isPlaying, stopPlaying, togglePlaying } = useContext(PlayerContext);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(VOLUME_DEFAULT);
  const [isMuted, setIsMuted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

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
      {track && (
        <>
          <div className={styles.left}>
            <TrackTitle
              trackName={track.name}
              artistName={track.artists[0].name}
              image={track.album.images[1].url}
              imageSize={track.album.images[1].height}
              classNameImage={styles.trackImage}
              classNameTrack={styles.trackName}
              classNameArtist={styles.trackArtist}
            />
          </div>

          <div className={styles.middle}>
            <div className={styles.middleTop}>
              <Tooltip text="Previous" position="top" showOnHover>
                <button className={styles.buttonSkip}>
                  <IconSkipPrevious className={styles.buttonSkipIcon} />
                </button>
              </Tooltip>
              <Tooltip
                text="Play"
                position="top"
                offset={12}
                showOnHover
                className={styles.buttonPlayWrapper}
              >
                <button
                  className={styles.buttonPlay}
                  onClick={() => togglePlaying()}
                >
                  {isPlaying ? <IconPause /> : <IconPlay />}
                </button>
              </Tooltip>
              <Tooltip text="Next" position="top" showOnHover>
                <button className={styles.buttonSkip}>
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
                }}
              >
                <source src={track.preview_url} />
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
            <Tooltip text={isMuted ? 'Unmute' : 'Mute'} position="top" showOnHover>
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
        </>
      )}
    </div>
  );
}

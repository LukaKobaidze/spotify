'use client';
import { IconKeyboardArrowDown } from '@/icons';
import styles from './MobilePlayer.module.scss';
import { useContext, useEffect } from 'react';
import { PlayerContext } from '@/context/player.context';
import Image from 'next/image';
import RangeSlider from './RangeSlider';
import AudioPlayback from './AudioPlayback';
import AudioPlayButton from './AudioPlayButton';
import { usePathname } from 'next/navigation';
import Controls from './Controls';
import { LibraryContext } from '@/context/library.context';
import LikeButton from '../LikeButton';

interface Props {
  currentTime: number;
  totalDuration: number;
  onCurrentTimeUpdate: (currentTime: number) => void;
  onClose: () => void;
}

export default function MobilePlayer(props: Props) {
  const { currentTime, totalDuration, onCurrentTimeUpdate, onClose } = props;

  const { player } = useContext(PlayerContext);
  const { liked, onSaveToLiked } = useContext(LibraryContext);
  const pathname = usePathname();

  const track = player?.list[player.currentlyPlaying];
  const album = player?.album || track?.album;
  const image = album?.images[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => onClose()} className={styles.closeButton}>
          <IconKeyboardArrowDown
            viewBox="0 0 20 20"
            className={styles.closeButtonIcon}
          />
        </button>
      </div>

      <div className={styles.main}>
        <div className={styles.imageWrapper}>
          {image && (
            <Image
              className={styles.image}
              src={image.url}
              width={image.width}
              height={image.height}
              alt=""
            />
          )}
        </div>
        {track && (
          <div className={styles.nameWrapper}>
            <div>
              <h2 className={styles.trackName}>{track.name}</h2>
              {album && <span>{album.name}</span>}
            </div>
            <div>
              <LikeButton
                className={styles.likeButton}
                active={liked.includes(track.id)}
                onClick={() => onSaveToLiked(track.id)}
                variant="large"
                tooltipDisabled
              />
            </div>
          </div>
        )}
        <AudioPlayback
          currentTime={currentTime}
          audioDuration={totalDuration}
          onCurrentTimeUpdate={onCurrentTimeUpdate}
          className={styles.audioPlayback}
        />
        <Controls
          className={styles.controls}
          classNamePlayButton={styles.playButton}
          classNameSkip={styles.skipButton}
          onResetCurrentTime={() => onCurrentTimeUpdate(0)}
        />
      </div>
    </div>
  );
}

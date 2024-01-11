'use client';
import { useContext } from 'react';
import { PlayerContext, PlayerTrackType } from '@/context/player.context';
import { IconPause, IconPlay } from '@/icons';
import { Optional } from '@/types';
import styles from './PlayButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data?: Optional<PlayerTrackType, 'currentlyPlaying'>;
  isButtonPlaying?: boolean;
  variant?: 'normal' | 'large';
}

export default function PlayButton(props: Props) {
  const {
    data,
    isButtonPlaying,
    variant = 'normal',
    className,
    onClick,
    ...restProps
  } = props;

  const { playTrack, playerTrack, isPlaying } = useContext(PlayerContext);

  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} ${
        className || ''
      }`}
      onClick={(e) => {
        if (data) {
          playTrack(data);
        }

        if (onClick) {
          onClick(e);
        }
      }}
      {...restProps}
    >
      {isButtonPlaying ||
      (data && playerTrack?.typeAndId === data.typeAndId && isPlaying) ? (
        <IconPause className={styles.buttonIcon} />
      ) : (
        <IconPlay className={styles.buttonIcon} />
      )}
    </button>
  );
}

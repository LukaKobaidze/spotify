'use client';
import { IconPause, IconPlay } from '@/icons';
import styles from './PlayButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isButtonPlaying: boolean;
  variant?: 'normal' | 'large';
}

export default function PlayButton(props: Props) {
  const { isButtonPlaying, variant = 'normal', className, ...restProps } = props;

  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} ${
        isButtonPlaying ? styles.active : ''
      } ${className || ''}`}
      {...restProps}
    >
      {isButtonPlaying ? (
        <IconPause className={styles.buttonIcon} />
      ) : (
        <IconPlay className={styles.buttonIcon} />
      )}
    </button>
  );
}

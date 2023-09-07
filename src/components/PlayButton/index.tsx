'use client';
import { IconPlay } from '@/icons';
import styles from './PlayButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'normal' | 'large';
}

export default function PlayButton(props: Props) {
  const { variant = 'normal', className, ...restProps } = props;

  return (
    <button className={`${styles.button} ${styles[`button--${variant}`]} ${className || ''}`} {...restProps}>
      <IconPlay className={styles.buttonIcon} />
    </button>
  );
}

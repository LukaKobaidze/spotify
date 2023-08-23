'use client';
import { IconPlay } from '@/icons';
import styles from './PlayButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function PlayButton(props: Props) {
  const { className, ...restProps } = props;

  return (
    <button className={`${styles.button} ${className || ''}`} {...restProps}>
      <IconPlay className={styles.buttonIcon} />
    </button>
  );
}

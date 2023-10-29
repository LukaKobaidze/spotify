import { IconPlay } from '@/icons';
import PlayButton from '../PlayButton/PlayButton';
import styles from './ItemPlayer.module.scss';

interface Props {
  variant?: '1' | '2';
  customPos?: { bottom?: number; right?: number };
  playerButtonClassName?: string;
  isActive?: boolean;
  classNameWrapper?: string;
  children?: React.ReactNode;
}

export default function ItemPlayer(props: Props) {
  const {
    variant = '1',
    customPos,
    playerButtonClassName,
    isActive,
    classNameWrapper,
    children,
  } = props;

  return (
    <div
      className={`${styles.container} ${isActive ? styles.active : ''} ${
        classNameWrapper || ''
      }`}
    >
      {children}
      <PlayButton
        className={`${styles.button} ${styles[`button--${variant}`]} ${
          playerButtonClassName || ''
        }`}
        style={
          customPos
            ? {
                bottom: customPos.bottom,
                right: customPos.right,
              }
            : undefined
        }
      />
    </div>
  );
}

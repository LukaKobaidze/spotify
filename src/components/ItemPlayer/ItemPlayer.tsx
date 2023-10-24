import { IconPlay } from '@/icons';
import PlayButton from '../PlayButton/PlayButton';
import styles from './ItemPlayer.module.scss';

interface Props {
  isActive?: boolean;
  playerOffset?: [number, number];
  classNameWrapper?: string;
  children?: React.ReactNode;
}

export default function ItemPlayer(props: Props) {
  const { isActive, playerOffset, classNameWrapper, children } = props;

  return (
    <div
      className={`${styles.container} ${isActive ? styles.active : ''} ${
        classNameWrapper || ''
      }`}
    >
      {children}
      <PlayButton
        className={styles.button}
        style={
          playerOffset
            ? { right: playerOffset[0], bottom: playerOffset[1] }
            : undefined
        }
      />
    </div>
  );
}

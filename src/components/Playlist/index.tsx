import { IconPlay } from '@/icons';
import styles from './Playlist.module.scss';
import PlayButton from '../PlayButton';

interface Props {
  isActive?: boolean;
  playerOffset?: [number, number];
  classNameWrapper?: string;
  children?: React.ReactNode;
}

export default function Playlist(props: Props) {
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

import { IconPlay } from '@/icons';
import styles from './Playlist.module.scss';

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
      <button
        className={styles.button}
        style={
          playerOffset
            ? { right: playerOffset[0], bottom: playerOffset[1] }
            : undefined
        }
      >
        <IconPlay className={styles.buttonIcon} />
      </button>
    </div>
  );
}

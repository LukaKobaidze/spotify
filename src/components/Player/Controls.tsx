import { IconSkipNext, IconSkipPrevious } from '@/icons';
import Tooltip from '../Tooltip';
import AudioPlayButton from './AudioPlayButton';
import { useContext } from 'react';
import { PlayerContext } from '@/context/player.context';
import styles from './Controls.module.scss';

interface Props {
  onResetCurrentTime: () => void;
  className?: string;
  classNamePlayButton?: string;
  classNameSkip?: string;
}

export default function Controls(props: Props) {
  const { onResetCurrentTime, className, classNamePlayButton, classNameSkip } =
    props;

  const { playPreviousTrack, playNextTrack } = useContext(PlayerContext);

  return (
    <div className={`${styles.controls} ${className || ''}`}>
      <Tooltip text="Previous" position="top">
        <button
          className={`${styles.buttonSkip} ${classNameSkip}`}
          onClick={() => {
            playPreviousTrack();
            onResetCurrentTime();
          }}
        >
          <IconSkipPrevious viewBox="0 0 24 24" className={styles.buttonSkipIcon} />
        </button>
      </Tooltip>
      <Tooltip text="Play" position="top" offset={12}>
        <AudioPlayButton className={classNamePlayButton} />
      </Tooltip>
      <Tooltip text="Next" position="top">
        <button
          className={`${styles.buttonSkip} ${classNameSkip}`}
          onClick={playNextTrack}
        >
          <IconSkipNext viewBox="0 0 24 24" className={styles.buttonSkipIcon} />
        </button>
      </Tooltip>
    </div>
  );
}

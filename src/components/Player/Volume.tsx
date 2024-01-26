import { IconVolumeHigh, IconVolumeLow, IconVolumeMute } from '@/icons';
import Tooltip from '../Tooltip';
import styles from './Volume.module.scss';
import { useEffect, useState } from 'react';
import RangeSlider from './RangeSlider';

const VOLUME_DEFAULT = 50;

interface Props {
  onVolumeChange: (volume: number) => void;
  onMuteToggle: (isMuted: boolean) => void;
  windowSize: number;
  className?: string;
}

export default function Volume(props: Props) {
  const { onMuteToggle, onVolumeChange, windowSize, className } = props;

  const [volumeState, setVolumeState] = useState(VOLUME_DEFAULT);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    onMuteToggle(isMuted);

    if (!isMuted && volumeState === 0) {
      setVolumeState(VOLUME_DEFAULT);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  useEffect(() => {
    onVolumeChange(volumeState);

    if (volumeState === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volumeState]);

  return (
    <div className={`${styles.volume} ${className || ''}`}>
      <Tooltip
        disabled={windowSize < 751}
        text={isMuted ? 'Unmute' : 'Mute'}
        position="top"
      >
        <button
          className={styles.volumeMuteButton}
          onClick={() => setIsMuted((state) => !state)}
        >
          {isMuted ? (
            <IconVolumeMute />
          ) : volumeState <= 50 ? (
            <IconVolumeLow />
          ) : (
            <IconVolumeHigh />
          )}
        </button>
      </Tooltip>

      <div className={styles.volumeRangeWrapper}>
        <RangeSlider
          value={isMuted ? 0 : volumeState}
          max={100}
          onChange={(value) => setVolumeState(value)}
          onChangeLive={(value) => setVolumeState(value)}
          direction={windowSize > 750 ? 'horizontal' : 'vertical'}
          className={styles.volumeRange}
        />
      </div>
    </div>
  );
}

import { forwardRef, useMemo, useState } from 'react';
import styles from './AudioPlayback.module.scss';
import { msToTime } from '@/helpers';
import RangeSlider from './RangeSlider';

interface Props {
  audioDuration: number | undefined;
  currentTime: number;
  onCurrentTimeUpdate: (currentTime: number) => void;
  className?: string;
}

export default function AudioPlayback(props: Props) {
  const { audioDuration, currentTime, onCurrentTimeUpdate, className } = props;

  const [activeSliderCurrentTime, setActiveSliderCurrentTime] = useState<
    number | null
  >(null);

  const currentTimeFormatted = useMemo(
    () =>
      msToTime(
        (activeSliderCurrentTime === null ? currentTime : activeSliderCurrentTime) *
          1000
      ),
    [currentTime, activeSliderCurrentTime]
  );

  return (
    <div className={`${styles.playback} ${className || ''}`}>
      <span className={styles.playbackTimerCurrent}>{currentTimeFormatted}</span>
      <RangeSlider
        value={
          activeSliderCurrentTime === null ? currentTime : activeSliderCurrentTime
        }
        max={Math.ceil(audioDuration || 0)}
        onChange={(value) => {
          onCurrentTimeUpdate(value);
          setActiveSliderCurrentTime(null);
        }}
        onChangeLive={(value) => setActiveSliderCurrentTime(value)}
        className={styles.playbackRange}
      />
      <span className={styles.playbackDuration}>
        {msToTime((audioDuration || 0) * 1000)}
      </span>
    </div>
  );
}

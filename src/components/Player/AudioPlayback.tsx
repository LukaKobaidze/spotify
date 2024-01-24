import { forwardRef, useMemo, useState } from 'react';
import styles from './AudioPlayer.module.scss';
import { msToTime } from '@/helpers';
import RangeSlider from './RangeSlider';

interface Props {
  audioSrc: string | undefined;
  audioDuration: number | undefined;
  onAudioEnded: () => void;
  currentTime: number;
  onCurrentTimeUpdate: (currentTime: number) => void;
  onAudioLoad: () => void;
}

type Ref = HTMLAudioElement;

export default forwardRef<Ref, Props>(function AudioPlayback(props, ref) {
  const {
    audioSrc,
    audioDuration,
    currentTime,
    onCurrentTimeUpdate,
    onAudioEnded,
    onAudioLoad,
  } = props;

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
    <div className={styles.playback}>
      <audio
        ref={ref}
        onLoadedData={onAudioLoad}
        onEnded={onAudioEnded}
        preload="true"
      >
        <source src={audioSrc} />
      </audio>
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
});

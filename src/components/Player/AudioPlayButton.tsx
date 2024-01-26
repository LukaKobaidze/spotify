import { PlayerContext } from '@/context/player.context';
import { IconPause, IconPlay } from '@/icons';
import { useContext } from 'react';
import styles from './AudioPlayButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function AudioPlayButton(props: Props) {
  const { className, onClick, ...restProps } = props;

  const { isPlaying, togglePlaying } = useContext(PlayerContext);

  const iconProps = {
    viewBox: '0 0 24 24',
    className: styles.playButtonIcon,
  };
  return (
    <button
      className={`${styles.playButton} ${className || ''}`}
      onClick={(e) => {
        togglePlaying();
        if (onClick) {
          onClick(e);
        }
      }}
      {...restProps}
    >
      {isPlaying ? <IconPause {...iconProps} /> : <IconPlay {...iconProps} />}
    </button>
  );
}

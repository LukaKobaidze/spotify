import PlayButton from '../PlayButton/PlayButton';
import styles from './ItemPlayer.module.scss';

interface Props {
  onPlayButtonClick: () => void;
  variant?: '1' | '2';
  customPos?: { bottom?: number; right?: number };
  playerButtonClassName?: string;
  isActive?: boolean;
  isButtonPlaying?: boolean;
  classNameWrapper?: string;
  children?: React.ReactNode;
}

export default function ItemPlayer(props: Props) {
  const {
    onPlayButtonClick,
    variant = '1',
    customPos,
    playerButtonClassName,
    isActive,
    isButtonPlaying,
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
        isButtonPlaying={isButtonPlaying}
        onClick={() => {
          onPlayButtonClick();
        }}
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

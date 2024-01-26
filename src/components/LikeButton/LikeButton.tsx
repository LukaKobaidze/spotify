import { IconHeart, IconHeartFill } from '@/icons';
import Tooltip from '@/components/Tooltip';
import styles from './LikeButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  variant?: 'normal' | 'large';
  tooltipDisabled?: boolean;
}

export default function LikeButton(props: Props) {
  const {
    active,
    variant = 'normal',
    tooltipDisabled,
    className,
    ...restProps
  } = props;

  return (
    <Tooltip
      text={active ? 'Remove from Your Library' : 'Save to Your Library'}
      position="top"
      offset={0}
      disabled={tooltipDisabled}
    >
      <button
        className={`${styles.buttonLike} ${styles[`buttonLike--${variant}`]} ${
          className || ''
        }`}
        {...restProps}
      >
        {active ? (
          <IconHeartFill
            viewBox="0 0 29 29"
            className={`${styles.icon} ${styles.iconFill}`}
          />
        ) : (
          <IconHeart viewBox="0 0 29 29" className={styles.icon} />
        )}
      </button>
    </Tooltip>
  );
}

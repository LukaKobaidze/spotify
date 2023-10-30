import { IconHeart, IconHeartFill } from '@/icons';
import Tooltip from '@/components/Tooltip';
import styles from './LikeButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  variant?: 'normal' | 'large';
}

export default function LikeButton(props: Props) {
  const { active, variant = 'normal', className, ...restProps } = props;

  return (
    <Tooltip
      text={active ? 'Remove from Your Library' : 'Save to Your Library'}
      position="top"
      offset={0}
    >
      <button
        className={`${styles.buttonLike} ${styles[`buttonLike--${variant}`]} ${
          className || ''
        }`}
        {...restProps}
      >
        {active ? <IconHeartFill className={styles.iconHeartFill} /> : <IconHeart />}
      </button>
    </Tooltip>
  );
}

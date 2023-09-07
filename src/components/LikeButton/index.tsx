import { IconHeart, IconHeartFill } from '@/icons';
import Tooltip from '../Tooltip';
import styles from './LikeButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  classNameContainer?: string;
}

export default function LikeButton(props: Props) {
  const { active, classNameContainer, className, ...restProps } = props;

  return (
    <Tooltip
      text={active ? 'Remove from Your Library' : 'Save to Your Library'}
      position="top"
      showOnHover
      offset={0}
      className={classNameContainer}
    >
      <button className={`${styles.buttonLike} ${className || ''}`} {...restProps}>
        {active ? <IconHeartFill className={styles.iconHeartFill} /> : <IconHeart />}
      </button>
    </Tooltip>
  );
}

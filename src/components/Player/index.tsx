import styles from './Player.module.scss';

interface Props {
  className?: string;
}

export default function Player(props: Props) {
  const { className } = props;

  return <div className={`${styles.container} ${className || ''}`}></div>;
}

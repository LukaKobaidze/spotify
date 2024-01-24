import styles from './LoadingSpinner.module.scss';

interface Props {}

export default function LoadingSpinner(props: Props) {
  return <div className={styles.spinner} />;
}

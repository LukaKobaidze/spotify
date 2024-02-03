import styles from './LoadingSpinner.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function LoadingSpinner(props: Props) {
  const { className, ...restProps } = props;

  return <div className={`${styles.spinner} ${className || ''}`} {...restProps} />;
}

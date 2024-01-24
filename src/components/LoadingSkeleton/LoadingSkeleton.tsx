import styles from './LoadingSkeleton.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>

export default function LoadingSkeleton(props: Props) {
  const { className, ...restProps } = props;


  return <div className={`${styles.skeleton} ${className}`} {...restProps} />
}
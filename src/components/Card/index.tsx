import Image from 'next/image';
import styles from './Card.module.scss';

interface Props {
  image: { src: string; width: number; height: number };
  title: string;
  subtitle: string;
}

export default function Card(props: Props) {
  const { image, title, subtitle } = props;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>

      <Image alt="" className={styles.image} {...image} fill={!image.width || !image.height} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
}

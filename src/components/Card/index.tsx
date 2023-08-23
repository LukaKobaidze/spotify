import Image from 'next/image';
import styles from './Card.module.scss';

interface Props {
  image: { src: string; width: number; height: number };
  title: string;
  subtitle: string;
  imageRounded?: boolean;
}

export default function Card(props: Props) {
  const { image, title, subtitle, imageRounded } = props;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>

      <Image alt="" className={`${styles.image} ${imageRounded ? styles.rounded : ''}`} {...image} fill={!image.width || !image.height} />
      </div>
      <h3 className={styles.title} title={title}>{title}</h3>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
}

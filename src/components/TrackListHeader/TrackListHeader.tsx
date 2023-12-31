import Link from 'next/link';
import styles from './TrackListHeader.module.scss';
import Image from 'next/image';
import { AlbumType, PlaylistType } from '@/services/spotify';

interface Props {
  data: PlaylistType | AlbumType;
}

export default function TrackListHeader({ data }: Props) {
  const image = data.images[1] || data.images[0];

  return (
    <Link href={`/${data.type}/${data.id}`} className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={image.url}
          width={image.width || undefined}
          height={image.height || undefined}
          fill={!image.width}
          alt=""
          className={styles.image}
        />
      </div>
      <div>
        <p className={styles.text}>From the {data.type}</p>
        <h3 className={styles.name}>{data.name}</h3>
      </div>
    </Link>
  );
}

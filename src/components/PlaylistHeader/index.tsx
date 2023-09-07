import { ArtistType } from '@/types';
import styles from './PlaylistHeader.module.scss';
import Image from 'next/image';

interface Props {
  image: { url: string; width: number; height: number };
  type: 'Album' | 'Playlist';
  title: string;
  subtitle: React.ReactNode;
  artist: ArtistType;
  className?: string;
}

export default function PlaylistHeader(props: Props) {
  const { image, type, title, subtitle, artist, className } = props;

  const artistImage = artist.images[artist.images.length - 1];

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Image
        src={image.url}
        width={image.width}
        height={image.height}
        alt=""
        className={styles.imageMain}
      />
      <div>
        <p className={styles.type}>{type}</p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.subtitle}>
          <Image
            src={artistImage.url}
            width={artistImage.width}
            height={artistImage.height}
            alt=""
            className={styles.subtitleImage}
          />
          <span className={styles.subtitleName}>{artist.name}</span>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

'use client';
import { ArtistType } from '@/services/spotify';
import styles from './PlayerHeader.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  image: { url: string; width: number | null; height: number | null };
  type: 'Song' | 'Album' | 'Playlist';
  title: string;
  subtitle: React.ReactNode;
  artist?: ArtistType;
  className?: string;
  classNameImage?: string;
}

export default function PlayerHeader(props: Props) {
  const { image, type, title, subtitle, artist, className, classNameImage } = props;

  const artistImage = artist?.images[artist.images.length - 1];

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.imageMainWrapper}>
        <Image
          src={image.url}
          width={image.width || undefined}
          height={image.height || undefined}
          alt=""
          fill={!image.width}
          className={`${styles.imageMain} ${classNameImage || ''}`}
        />
      </div>
      <div>
        <p className={styles.type}>{type}</p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.subtitle}>
          {artist && (
            <Link href={`/artist/${artist.id}`} className={styles.artistAnchor}>
              <Image
                src={artistImage!.url}
                width={artistImage!.width}
                height={artistImage!.height}
                alt=""
                className={styles.subtitleImage}
              />
              <span className={styles.subtitleName}>{artist.name}</span>
            </Link>
          )}
          {subtitle}
        </div>
      </div>
    </div>
  );
}
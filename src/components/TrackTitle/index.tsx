'use client';
import Image from 'next/image';
import styles from './TrackTitle.module.scss';
import Link from 'next/link';

interface Props {
  trackName: string;
  trackId: string;
  artistName: string;
  artistId: string;
  image?: string;
  imageSize?: number;
  classNameImage?: string;
  classNameTrack?: string;
  classNameArtist?: string;
}

export default function TrackTitle(props: Props) {
  const {
    trackName,
    trackId,
    artistName,
    artistId,
    image,
    imageSize,
    classNameImage,
    classNameTrack,
    classNameArtist,
  } = props;

  return (
    <div className={styles.container}>
      {image && (
        <Image
          alt=""
          src={image}
          width={imageSize}
          height={imageSize}
          className={`${styles.image} ${classNameImage || ''}`}
        />
      )}
      <div className={styles.text}>
        <Link
          href={`/track/${trackId}`}
          className={`linkHoverUnderline ${styles.textTrack} ${
            classNameTrack || ''
          }`}
        >
          {trackName}
        </Link>
        <Link
          href={`/artist/${artistId}`}
          className={`linkHoverUnderline ${styles.textArtist} ${
            classNameArtist || ''
          }`}
        >
          {artistName}
        </Link>
      </div>
    </div>
  );
}

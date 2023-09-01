'use client';
import Image from 'next/image';
import styles from './TrackTitle.module.scss';

interface Props {
  trackName: string;
  artistName: string;
  image?: string;
  imageSize?: number;
  classNameImage?: string;
  classNameTrack?: string;
  classNameArtist?: string;
}

export default function TrackTitle(props: Props) {
  const {
    trackName,
    artistName,
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
        <span className={`${styles.textTrack} ${classNameTrack || ''}`}>
          {trackName}
        </span>
        <span className={`${styles.textArtist} ${classNameArtist || ''}`}>
          {artistName}
        </span>
      </div>
    </div>
  );
}

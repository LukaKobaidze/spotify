'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrackTitle.module.scss';

interface Props {
  trackName: string;
  trackId: string;
  artistName: string;
  artistId: string;
  image?: string;
  imageSize?: number;
  className?: string;
  classNameText?: string;
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
    className,
    classNameText,
    classNameImage,
    classNameTrack,
    classNameArtist,
  } = props;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {image && (
        <Image
          alt=""
          src={image}
          width={imageSize}
          height={imageSize}
          className={`${styles.image} ${classNameImage || ''}`}
        />
      )}
      <div className={`${styles.text} ${classNameText || ''}`}>
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

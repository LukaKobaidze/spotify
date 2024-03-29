'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { LayoutContext } from '@/context/layout.context';
import { ArtistType } from '@/services/spotify';
import FluidTypography from '@/components/FluidTypography';
import styles from './PlayerHeader.module.scss';

interface Props {
  image: { url: string; width: number | null; height: number | null };
  type: 'Song' | 'Album' | 'Playlist' | 'Single';
  title: string;
  subtitle: React.ReactNode;
  artist?: ArtistType;
  className?: string;
  classNameImage?: string;
}

export default function PlayerHeader(props: Props) {
  const { image, type, title, subtitle, artist, className, classNameImage } = props;

  const { mainViewSize } = useContext(LayoutContext);
  const imageRef = useRef<HTMLImageElement>(null);

  const [backgroundColorRGB, setBackgroundColorRGB] = useState<string | null>(null);

  const artistImage = artist?.images[artist.images.length - 1];
  const imageSize = Math.max(Math.min(mainViewSize / 2.8, 232), 160);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div
        className={styles.containerBackground}
        style={
          backgroundColorRGB
            ? {
                background: `-webkit-linear-gradient(top, rgba(${backgroundColorRGB}, 0.4), rgba(${backgroundColorRGB}, 0))`,
              }
            : undefined
        }
      />
      <div
        className={styles.imageMainWrapper}
        style={{ width: imageSize, height: imageSize }}
      >
        <Image
          ref={imageRef}
          src={image.url}
          width={232 || undefined}
          height={232 || undefined}
          alt=""
          className={`${styles.imageMain} ${classNameImage || ''}`}
          onLoad={(e) => {
            const colorThief = new ColorThief();

            setBackgroundColorRGB(
              colorThief.getColor(e.target as HTMLImageElement).join(', ')
            );
          }}
        />
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.type}>{type}</p>
        <FluidTypography
          element="h1"
          sizeMin={26}
          sizeMax={72}
          windowWidthMin={300}
          windowWidthMax={1300}
          className={styles.title}
        >
          {title}
        </FluidTypography>
        <div
          className={`${styles.subtitle} ${
            mainViewSize < 650 ? styles['subtitle--breakpoint-1'] : ''
          }`}
        >
          {artist && (
            <Link href={`/artist/${artist.id}`} className={styles.artistAnchor}>
              <Image
                src={artistImage!.url}
                width={24}
                height={24}
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

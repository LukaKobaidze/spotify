'use client';
import { ImageType } from '@/services/spotify';
import Image from 'next/image';
import ColorThief from 'colorthief';
import { useState } from 'react';
import styles from './Hero.module.scss';

interface Props {
  name: string;
  totalFollowers: number;
  image: ImageType;
}

export default function Hero(props: Props) {
  const { name, totalFollowers, image } = props;

  const [backgroundRgb, setBackgroundRgb] = useState('');

  return (
    <div className={styles.hero}>
      <div
        className={styles.heroBackground}
        style={
          backgroundRgb
            ? {
                background: `-webkit-linear-gradient(top, rgba(${backgroundRgb}, 0.5), rgba(${backgroundRgb}, 0))`,
              }
            : undefined
        }
      />

      <div className={styles.heroContentWrapper}>
        <div>
          <h1 className={styles.heroHeading}>{name}</h1>
          <p className={styles.heroFollowers}>
            {totalFollowers.toLocaleString()} followers
          </p>
        </div>

        {image && (
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt=""
            className={styles.heroImage}
            onLoad={(e) => {
              const colorThief = new ColorThief();

              setBackgroundRgb(
                colorThief.getColor(e.target as HTMLImageElement).join(', ')
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

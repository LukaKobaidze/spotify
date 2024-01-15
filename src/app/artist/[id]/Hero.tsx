'use client';
import Image from 'next/image';
import { useContext, useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { ImageType } from '@/services/spotify';
import { LayoutContext } from '@/context/layout.context';
import FluidTypography from '@/components/FluidTypography';
import styles from './Hero.module.scss';

interface Props {
  name: string;
  totalFollowers: number;
  image: ImageType;
}

export default function Hero(props: Props) {
  const { name, totalFollowers, image } = props;

  const { mainViewSize } = useContext(LayoutContext);
  const headingRef = useRef<HTMLDivElement>(null);

  const [backgroundRgb, setBackgroundRgb] = useState('');

  return (
    <div
      className={`${styles.hero} ${
        mainViewSize - (headingRef.current?.clientWidth || 0) < 225
          ? styles['hero--breakpoint-1']
          : ''
      }`}
    >
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
        <div ref={headingRef}>
          <FluidTypography
            element="h1"
            sizeMin={40}
            sizeMax={100}
            windowWidthMin={300}
            windowWidthMax={1300}
            className={styles.heroHeading}
          >
            {name}
          </FluidTypography>
          <p className={styles.heroFollowers}>
            {totalFollowers.toLocaleString()} followers
          </p>
        </div>

        <div className={styles.heroImageWrapper}>
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
    </div>
  );
}

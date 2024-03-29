'use client';
import Image from 'next/image';
import { useContext } from 'react';
import { AlbumType, ArtistType, PlaylistType } from '@/services/spotify';
import { MenuContext } from '@/context/menu.context';
import { LibraryContext } from '@/context/library.context';
import { IconAdd, IconRemove, IconUser } from '@/icons';
import styles from './Card.module.scss';

interface Props {
  data: AlbumType | PlaylistType | ArtistType;
  subtitle: string;
  subtitleMaxLines?: number;
  imageRounded?: boolean;
}

export default function Card(props: Props) {
  const { data, subtitle, subtitleMaxLines, imageRounded } = props;

  const { renderMenu } = useContext(MenuContext);
  const { onSaveToLibrary, libraryHas } = useContext(LibraryContext);

  const image = data.images[1] || data.images[0];

  const handleCardRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const isAdded = libraryHas(data);

    renderMenu({
      windowPos: { x: e.pageX, y: e.pageY },
      items: [
        {
          type: 'button',
          name: isAdded
            ? { Icon: IconRemove, text: 'Remove from your library' }
            : { Icon: IconAdd, text: 'Add to Your Library' },
          action: () => {
            onSaveToLibrary(data);
          },
        },
      ],
    });
  };

  return (
    <div className={styles.card} onContextMenu={handleCardRightClick}>
      <div className={styles.imageWrapper}>
        {image?.url ? (
          !image.width || !image.height ? (
            <Image
              alt=""
              className={`${styles.image} ${imageRounded ? styles.rounded : ''}`}
              src={image.url}
              fill
              sizes="157px"
            />
          ) : (
            <Image
              alt=""
              className={`${styles.image} ${imageRounded ? styles.rounded : ''}`}
              src={image.url}
              width={image.width}
              height={image.height}
              sizes="157px"
            />
          )
        ) : (
          <div
            className={`${styles.image} ${imageRounded ? styles.rounded : ''} ${
              styles.userIconWrapper
            }`}
          >
            <IconUser className={styles.userIcon} />
          </div>
        )}
      </div>
      <h3 className={`oneLinerEllipsis ${styles.title}`} title={data.name}>
        {data.name}
      </h3>
      <span
        className={styles.subtitle}
        style={
          subtitleMaxLines
            ? { WebkitLineClamp: subtitleMaxLines, lineClamp: subtitleMaxLines }
            : undefined
        }
      >
        {subtitle}
      </span>
    </div>
  );
}

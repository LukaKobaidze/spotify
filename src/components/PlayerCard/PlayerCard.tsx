'use client';

import Link from 'next/link';
import ItemPlayer from '../ItemPlayer';
import Card from '../Card';
import {
  AlbumType,
  ArtistType,
  PlaylistType,
  PlaylistWithNoTracksType,
} from '@/services/spotify';
import styles from './PlayerCard.module.scss';

interface Props {
  data: PlaylistWithNoTracksType | PlaylistType | AlbumType | ArtistType;
  description?: string;
  imageRounded?: boolean;
  customPos?: { bottom?: number; right?: number };
  className?: string;
}

export default function PlayerCard(props: Props) {
  const { data, description, imageRounded, customPos, className } = props;

  return (
    <ItemPlayer
      key={data.id}
      customPos={customPos || { bottom: 114 }}
      data={data}
      classNameWrapper={`${styles.container} ${className}`}
    >
      <Link href={`/${data.type}/${data.id}`}>
        <Card
          data={data}
          subtitle={description || ''}
          subtitleMaxLines={2}
          imageRounded={imageRounded}
        />
      </Link>
    </ItemPlayer>
  );
}

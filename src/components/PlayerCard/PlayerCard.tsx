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

interface Props {
  data: PlaylistWithNoTracksType | PlaylistType | AlbumType | ArtistType;
  description?: string;
  imageRounded?: boolean;
  customPos?: { bottom?: number; right?: number };
}

export default function PlayerCard(props: Props) {
  const { data, description, imageRounded, customPos } = props;

  return (
    <ItemPlayer key={data.id} customPos={customPos || { bottom: 114 }} data={data}>
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

'use client';
import Card from '@/components/Card';
import ItemPlayer from '@/components/ItemPlayer';
import ItemsRow from '@/components/ItemsRow';
import { PlaylistType } from '@/services/spotify';
import Link from 'next/link';

interface Props {
  data: PlaylistType[];
  className?: string;
}

export default function SpotifyPlaylists({ data, className }: Props) {
  return (
    <ItemsRow heading="Spotify Playlists" className={className}>
      {(renderAmount) => {
        return data.slice(0, renderAmount).map((playlist) => {
          return (
            <ItemPlayer key={playlist.id} customPos={{ bottom: 114 }}>
              <Link href={'/playlist/' + playlist.id}>
                <Card
                  data={playlist}
                  subtitle={playlist.description}
                  subtitleMaxLines={2}
                />
              </Link>
            </ItemPlayer>
          );
        });
      }}
    </ItemsRow>
  );
}

'use client';
import Card from '@/components/Card';
import ItemPlayer from '@/components/ItemPlayer';
import ItemsRow from '@/components/ItemsRow';
import PlaylistItem from '@/components/PlaylistItem/PlaylistItem';
import { PlaylistType } from '@/services/spotify';
import Link from 'next/link';

interface Props {
  data: PlaylistType[];
  accessToken: string | undefined;
  className?: string;
}

export default function SpotifyPlaylists(props: Props) {
  const { data, accessToken, className } = props;

  return (
    <ItemsRow heading="Spotify Playlists" className={className}>
      {(renderAmount) => {
        return data
          .slice(0, renderAmount)
          .map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              data={playlist}
              accessToken={accessToken}
            />
          ));
      }}
    </ItemsRow>
  );
}

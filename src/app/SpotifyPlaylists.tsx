'use client';
import { PlaylistType } from '@/services/spotify';
import ItemsRow from '@/components/ItemsRow';
import PlayerCard from '@/components/PlayerCard';

interface Props {
  data: PlaylistType[];
  className?: string;
}

export default function SpotifyPlaylists(props: Props) {
  const { data, className } = props;

  return (
    <ItemsRow heading="Spotify Playlists" className={className}>
      {(renderAmount) => {
        return data
          .slice(0, renderAmount)
          .map((playlist) => (
            <PlayerCard
              key={playlist.id}
              data={playlist}
              description={playlist.description}
            />
          ));
      }}
    </ItemsRow>
  );
}

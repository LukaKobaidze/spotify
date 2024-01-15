'use client';
import { FeaturedPlaylistsType } from '@/services/spotify';
import ItemsRow from '@/components/ItemsRow';
import PlayerCard from '@/components/PlayerCard';

interface Props {
  data: FeaturedPlaylistsType;
  className?: string;
}

export default function FeaturedPlaylists(props: Props) {
  const { data, className } = props;

  return (
    <ItemsRow heading="Featured Playlists" className={className}>
      {(renderAmount) => {
        return data.items
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

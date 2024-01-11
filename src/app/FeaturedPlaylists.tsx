'use client';
import { FeaturedPlaylistsType } from '@/services/spotify';
import ItemsRow from '@/components/ItemsRow';
import PlaylistItem from '@/components/PlaylistItem/PlaylistItem';

interface Props {
  data: FeaturedPlaylistsType;
  accessToken: string | undefined;
  className?: string;
}

export default function FeaturedPlaylists(props: Props) {
  const { data, accessToken, className } = props;

  return (
    <ItemsRow heading="Featured Playlists" className={className}>
      {(renderAmount) => {
        return data.items
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

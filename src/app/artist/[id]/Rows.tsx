'use client';
import { AlbumType, ArtistType, DataType } from '@/services/spotify';
import ItemsRow from '@/components/ItemsRow';
import styles from './Rows.module.scss';
import PlayerCard from '@/components/PlayerCard';

interface Props {
  albums: DataType<AlbumType> | null;
  relatedArtists: ArtistType[] | null | undefined;
  artistId: string;
}

export default function Rows({ albums, relatedArtists, artistId }: Props) {
  return (
    <>
      {albums && !!albums.total && (
        <ItemsRow
          heading="Albums"
          anchor={{ name: 'Show all', href: artistId + '/albums' }}
          className={styles.row}
        >
          {(renderAmount) => {
            return albums.items
              .slice(0, renderAmount)
              .map((album) => (
                <PlayerCard
                  key={album.id}
                  data={album}
                  description={
                    album.release_date.slice(0, album.release_date.indexOf('-')) +
                    ' • ' +
                    album.artists[0].name
                  }
                  customPos={{ bottom: 95 }}
                />
              ));
          }}
        </ItemsRow>
      )}

      {relatedArtists && !!relatedArtists.length && (
        <ItemsRow
          heading="Fans also like"
          anchor={{ name: 'Show all', href: artistId + '/related' }}
          className={styles.row}
        >
          {(renderAmount) => {
            return relatedArtists.slice(0, renderAmount).map((artist) => {
              return (
                <PlayerCard
                  key={artist.id}
                  data={artist}
                  customPos={{ bottom: 80 }}
                  imageRounded
                />
              );
            });
          }}
        </ItemsRow>
      )}
    </>
  );
}

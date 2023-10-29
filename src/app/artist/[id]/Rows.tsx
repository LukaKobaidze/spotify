'use client';

import { AlbumType, ArtistType, DataType } from '@/services/spotify';
import Link from 'next/link';
import Card from '@/components/Card';
import ItemPlayer from '@/components/ItemPlayer';
import ItemsRow from '@/components/ItemsRow';
import styles from './Rows.module.scss';

interface Props {
  albums: DataType<AlbumType> | null;
  relatedArtists: ArtistType[] | null;
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
            return albums.items.slice(0, renderAmount).map((album) => (
              <ItemPlayer key={album.id}>
                <Link href={'/album/' + album.id}>
                  <Card
                    data={album}
                    subtitle={
                      album.release_date.slice(0, album.release_date.indexOf('-')) +
                      ' • ' +
                      album.artists[0].name
                    }
                  />
                </Link>
              </ItemPlayer>
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
                <ItemPlayer key={artist.id}>
                  <Link href={'/artist/' + artist.id}>
                    <Card data={artist} subtitle="Artist" imageRounded />
                  </Link>
                </ItemPlayer>
              );
            });
          }}
        </ItemsRow>
      )}
    </>
  );
}

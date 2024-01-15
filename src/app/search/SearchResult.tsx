'use client';
import Link from 'next/link';
import Image from 'next/image';
import { SearchDataType } from '@/services/spotify';
import ItemPlayer from '@/components/ItemPlayer';
import Tracks from '@/components/Tracks';
import Card from '@/components/Card';
import ItemsRow from '@/components/ItemsRow';
import styles from './SearchResult.module.scss';

interface Props {
  data: SearchDataType;
  searchValue: string;
}

export default function SearchResult(props: Props) {
  const { data, searchValue } = props;

  const topResult = data.artists?.items[0];

  return (
    <div>
      <div className={styles.top}>
        {topResult && (
          <div className={styles.topResult}>
            <h2 className={styles.topHeading}>Top result</h2>

            <ItemPlayer variant="2" data={topResult}>
              <Link
                href={'artist/' + topResult.id}
                className={styles.topResultAnchor}
              >
                <Image
                  src={topResult.images[1].url}
                  width={topResult.images[1].height}
                  height={topResult.images[1].height}
                  alt=""
                  className={styles.topResultAnchorImage}
                />
                <span className={styles.topResultAnchorName}>{topResult.name}</span>
                <span className={styles.topResultAnchorTag}>Artist</span>
              </Link>
            </ItemPlayer>
          </div>
        )}

        {data.tracks?.items && data.tracks.items.length && (
          <div className={styles.tracksWrapper}>
            <h2 className={styles.topHeading}>Songs</h2>
            <Tracks
              playerId={'search' + searchValue}
              data={data.tracks?.items?.slice(0, 4) || []}
              bodyGap={0}
              hideHeaderLabels
              hideIndexing
              hideAlbumColumn
              className={styles.tracks}
            />
          </div>
        )}
      </div>

      {data.albums?.items && data.albums.items.length && (
        <ItemsRow heading="Albums" className={styles.albumsRow}>
          {(renderAmount) => {
            return data.albums.items.slice(0, renderAmount).map((album) => (
              <ItemPlayer key={album.id} data={album}>
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

      {data.playlists?.items?.length && (
        <ItemsRow heading="Playlists" className={styles.row}>
          {(renderAmount) => {
            return data.playlists.items.slice(0, renderAmount).map((playlist) => (
              <ItemPlayer key={playlist.id} data={playlist}>
                <Link href={'/playlist/' + playlist.id}>
                  <Card
                    data={playlist}
                    subtitle={'By ' + playlist.owner.display_name}
                  />
                </Link>
              </ItemPlayer>
            ));
          }}
        </ItemsRow>
      )}

      {data.artists.items.length && (
        <ItemsRow heading="Artists" className={styles.row}>
          {(renderAmount) => {
            return data.artists.items.slice(0, renderAmount).map((artist) => (
              <ItemPlayer key={artist.id} data={artist}>
                <Link href={'/artist/' + artist.id}>
                  <Card data={artist} subtitle="Artist" imageRounded />
                </Link>
              </ItemPlayer>
            ));
          }}
        </ItemsRow>
      )}
    </div>
  );
}

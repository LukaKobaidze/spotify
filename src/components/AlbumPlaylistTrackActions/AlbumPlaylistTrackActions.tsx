'use client';
import { useContext } from 'react';
import { AlbumType, PlaylistType, TrackType } from '@/services/spotify';
import { LibraryContext } from '@/context/library.context';
import PlayButton from '@/components/PlayButton';
import LikeButton from '@/components/LikeButton';
import styles from './AlbumPlaylistTrackActions.module.scss';

interface Props {
  data: AlbumType | PlaylistType | TrackType;
}

export default function AlbumPlaylistTrackActions(props: Props) {
  const { data } = props;

  const { libraryItems, onSaveToLibrary, onSaveToLiked, libraryHas } =
    useContext(LibraryContext);

  return (
    <div className={styles.actions}>
      <PlayButton variant="large" className={styles.playButton} />
      <LikeButton
        active={libraryHas(data)}
        variant="large"
        onClick={() => {
          if (data.type === 'track') {
            onSaveToLiked(data.id);
          } else {
            onSaveToLibrary(data as AlbumType | PlaylistType);
          }
        }}
      />
    </div>
  );
}

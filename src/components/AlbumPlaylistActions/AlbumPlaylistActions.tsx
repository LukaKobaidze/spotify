'use client';
import { useContext } from 'react';
import { AlbumType, PlaylistType } from '@/services/spotify';
import { LibraryContext } from '@/context/library.context';
import PlayButton from '@/components/PlayButton';
import LikeButton from '@/components/LikeButton';
import styles from './AlbumPlaylistActions.module.scss';

interface Props {
  data: AlbumType | PlaylistType;
}

export default function AlbumPlaylistActions(props: Props) {
  const { data } = props;

  const { libraryItems, onSaveToLibrary, libraryHas } = useContext(LibraryContext);

  return (
    <div className={styles.actions}>
      <PlayButton variant="large" className={styles.playButton} />
      <LikeButton
        active={libraryHas(data)}
        variant="large"
        onClick={() => {
          onSaveToLibrary(data);
        }}
      />
    </div>
  );
}

'use client';
import LikeButton from '@/components/LikeButton';
import PlayButton from '@/components/PlayButton';
import styles from './Actions.module.scss';

interface Props {
  playlistData
}

export default function Actions(props: Props) {
  return (
    <div className={styles.actions}>
      <PlayButton variant="large" className={styles.playButton} />
      <LikeButton
        active={libraryItems.some((item) => item.id === albumData.id)}
        variant="large"
        onClick={() => {
          onSaveToLibrary(albumData);
        }}
      />
    </div>
  );
}

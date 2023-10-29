'use client';
import { useContext } from 'react';
import LikeButton from '@/components/LikeButton';
import PlayButton from '@/components/PlayButton';
import { LibraryContext } from '@/context/library.context';
import { PlayerContext } from '@/context/player.context';
import styles from './Actions.module.scss';
import { TrackType } from '@/services/spotify';

interface Props {
  trackData: TrackType;
}

export default function Actions(props: Props) {
  const { trackData } = props;

  const { liked, onSaveToLiked } = useContext(LibraryContext);
  const { playTrack } = useContext(PlayerContext);

  return (
    <div className={styles.actions}>
      <PlayButton variant="large" onClick={() => playTrack(trackData)} />
      <LikeButton
        active={liked.includes(trackData.id)}
        variant="large"
        onClick={() => onSaveToLiked(trackData.id)}
      />
    </div>
  );
}

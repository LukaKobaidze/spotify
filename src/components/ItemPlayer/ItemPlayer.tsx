'use client';
import { useContext } from 'react';
import {
  AlbumType,
  ArtistType,
  PlaylistType,
  PlaylistWithNoTracksType,
  TrackType,
} from '@/services/spotify';
import { getPlayerId } from '@/helpers';
import { PlayerContext } from '@/context/player.context';
import PlayButton from '@/components/PlayButton';
import styles from './ItemPlayer.module.scss';

interface Props {
  data: PlaylistWithNoTracksType | PlaylistType | AlbumType | ArtistType | TrackType;
  variant?: '1' | '2';
  customPos?: { bottom?: number; right?: number };
  playerButtonClassName?: string;
  classNameWrapper?: string;
  children?: React.ReactNode;
}

export default function ItemPlayer(props: Props) {
  const {
    data,
    variant = '1',
    customPos,
    playerButtonClassName,
    classNameWrapper,
    children,
  } = props;

  const { player, startPlayer, isPlaying } = useContext(PlayerContext);

  const isButtonPlaying = getPlayerId(data) === player?.id && isPlaying;

  return (
    <div
      className={`${styles.container} ${isButtonPlaying ? styles.active : ''} ${
        classNameWrapper || ''
      }`}
    >
      {children}
      <PlayButton
        isButtonPlaying={isButtonPlaying}
        onClick={() => {
          startPlayer({
            argumentType: 'data',
            data: data,
            album: data.type === 'album' ? data : undefined,
          });
        }}
        className={`${styles.button} ${styles[`button--${variant}`]} ${
          playerButtonClassName || ''
        }`}
        style={
          customPos
            ? {
                bottom: customPos.bottom,
                right: customPos.right,
              }
            : undefined
        }
      />
    </div>
  );
}

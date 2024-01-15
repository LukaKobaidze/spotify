'use client';
import { useContext } from 'react';
import { Optional } from '@/types';
import { AlbumType, PlaylistType, TrackType } from '@/services/spotify';
import { LibraryContext } from '@/context/library.context';
import PlayButton from '@/components/PlayButton';
import LikeButton from '@/components/LikeButton';
import styles from './AlbumPlaylistTrackActions.module.scss';
import { PlayerContext } from '@/context/player.context';
import { getPlayerId } from '@/helpers/player';

interface Props {
  data: AlbumType | PlaylistType | TrackType;
  trackList: Optional<TrackType, 'album'>[];
  listAlbum?: Omit<
    AlbumType,
    | 'external_ids'
    | 'genres'
    | 'label'
    | 'popularity'
    | 'tracks'
    | 'copyrights'
    | 'available_markets'
    | 'album_group'
  >;
}

export default function AlbumPlaylistTrackActions(props: Props) {
  const { data, trackList, listAlbum } = props;

  const { player, startPlayer, isPlaying } = useContext(PlayerContext);
  const { onSaveToLibrary, onSaveToLiked, libraryHas } = useContext(LibraryContext);

  const localPlayerId = getPlayerId(data);

  return (
    <div className={styles.actions}>
      <PlayButton
        variant="large"
        onClick={() =>
          startPlayer({
            argumentType: 'data',
            data: data,
            tracks: trackList,
            album: listAlbum,
          })
        }
        isButtonPlaying={player?.id === localPlayerId && isPlaying}
        className={styles.playButton}
      />
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

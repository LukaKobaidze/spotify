'use client';
import { PlaylistWithNoTracksType, fetchPlaylist } from '@/services/spotify';
import ItemPlayer from '../ItemPlayer';
import Link from 'next/link';
import Card from '../Card';
import { useContext } from 'react';
import { PlayerContext } from '@/context/player.context';

interface Props {
  data: PlaylistWithNoTracksType;
  accessToken: string | undefined;
}

export default function PlaylistItem({ data, accessToken }: Props) {
  const { playTrack, playerTrack, isPlaying } = useContext(PlayerContext);

  const typeAndId = 'playlist' + data.id;

  const handlePlayPlaylist = () => {
    if (!accessToken) return;

    fetchPlaylist(accessToken, data.id).then((data) =>
      playTrack({
        list: data.tracks.items.map((item) => item.track),
        typeAndId,
      })
    );
  };

  return (
    <ItemPlayer
      customPos={{ bottom: 114 }}
      isButtonPlaying={typeAndId === playerTrack?.typeAndId && isPlaying}
      onPlayButtonClick={() => handlePlayPlaylist()}
    >
      <Link href={'/playlist/' + data.id}>
        <Card data={data} subtitle={data.description} subtitleMaxLines={2} />
      </Link>
    </ItemPlayer>
  );
}

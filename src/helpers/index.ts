import {
  AlbumType,
  ArtistType,
  PlaylistType,
  PlaylistWithNoTracksType,
  TrackType,
} from '@/services/spotify';

export function getPlayerId(
  data: PlaylistWithNoTracksType | PlaylistType | AlbumType | ArtistType | TrackType
) {
  if (!data?.type) return '';

  return data.type + data.id;
}

export function msToTime(milliseconds: number) {
  //Get hours from milliseconds
  var hours = milliseconds / (1000 * 60 * 60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

  if (h === '00') {
    return m + ':' + s;
  }

  return h + ':' + m + ':' + s;
}

export function msToTimeFormatted(milliseconds: number) {
  const time = msToTime(milliseconds).split(':');

  if (time.length === 3) {
    const [hr, min, sec] = time;

    return `${hr} hour ${min} min ${sec} sec`;
  } else {
    const [min, sec] = time;

    return `${min} min ${sec} sec`;
  }
}

export function getAlbumReleaseYear(releaseDate: string) {
  return releaseDate.slice(0, releaseDate.indexOf('-'));
}

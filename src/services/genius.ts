import { Client as Genius } from 'genius-lyrics';

export async function fetchLyrics(trackName: string, trackArtist: string) {
  const genius = new Genius(process.env.GENIUS_ACCESS_TOKEN);

  const searches = await genius.songs.search(trackName + ' ' + trackArtist);

  return await searches[0]?.lyrics();
}

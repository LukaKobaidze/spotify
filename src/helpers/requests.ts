export async function spotifySearch(token: string, searchValue: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${searchValue}&type=artist,track`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
  );

  return res.json();
}

export async function fetchSearch(
  accessToken: string,
  searchValue: string,
  limit?: number
) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${searchValue}&type=artist,track,album,playlist${
      limit ? `&limit=${limit}` : ''
    }`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );

  return res.json();
}

export async function fetchArtist(accessToken: string, id: string) {
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });

  return res.json();
}

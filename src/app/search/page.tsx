import { cookies } from 'next/headers';
import Header from '@/components/Header/Header';
import Searchbar from './Searchbar';
import SearchResult from './SearchResult';

interface Props {
  searchParams?: {
    value?: string;
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token');

  const data =
    !accessToken || !searchParams?.value
      ? null
      : await fetch(
          `https://api.spotify.com/v1/search?q=${searchParams.value}&type=artist,track,album,playlist&limit=6`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + accessToken.value,
            },
          }
        ).then((data) => data.json());

  return (
    <>
      <Header>
        <Searchbar initialValue={searchParams?.value || ''} />
      </Header>
      <main>{data && <SearchResult data={data} />}</main>
    </>
  );
}

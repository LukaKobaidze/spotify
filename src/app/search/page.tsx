import { cookies } from 'next/headers';
import { fetchSearch } from '@/services/spotify';
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
  const accessToken = cookieStore.get('access_token')?.value;

  const data =
    !accessToken || !searchParams?.value
      ? null
      : await fetchSearch(accessToken, searchParams.value);

  return (
    <>
      <Header>
        <Searchbar initialValue={searchParams?.value || ''} />
      </Header>
      <main>{data && <SearchResult data={data} />}</main>
    </>
  );
}

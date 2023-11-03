import { cookies } from 'next/headers';
import { fetchSearch, fetchSeveralBrowseCategories } from '@/services/spotify';
import Header from '@/components/Header/Header';
import Searchbar from './Searchbar';
import SearchResult from './SearchResult';
import BrowseCategories from './BrowseCategories';
import ConsoleLogToClient from '@/components/ConsoleLogToClient/ConsoleLogToClient';

interface Props {
  searchParams?: {
    value?: string;
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const browseCategoriesData = accessToken
    ? await fetchSeveralBrowseCategories(accessToken, 50)
    : null;
  const searchResultData =
    !accessToken || !searchParams?.value
      ? null
      : await fetchSearch(accessToken, searchParams.value);

  return (
    <>
      <Header>
        <Searchbar initialValue={searchParams?.value || ''} />
      </Header>
      <main>
        {searchResultData ? (
          <SearchResult data={searchResultData} />
        ) : (
          <BrowseCategories data={browseCategoriesData} />
        )}
      </main>
    </>
  );
}

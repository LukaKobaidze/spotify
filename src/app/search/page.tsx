'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Searchbar from '@/components/Searchbar';
import styles from './page.module.scss';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import { spotifySearch } from '@/helpers/requests';
import Songs from '@/components/Songs';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useContext(SpotifyAccessContext);
  const [searchInput, setSearchInput] = useState(searchParams.get('value') || '');
  const [searchResult, setSearchResult] = useState<any>();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (searchInput.trim().length === 0) {
      router.replace('/search');
    } else {
      timeout = setTimeout(() => {
        router.replace(`/search?value=${searchInput}`);
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [router, searchInput]);

  const search = searchParams.get('value');
  useEffect(() => {
    if (!search) {
      setSearchResult(undefined);
    } else {
      spotifySearch(token, search).then((data) => setSearchResult(data));
    }
  }, [search, token]);

  return (
    <>
      <Header>
        <Searchbar
          classNameContainer={styles.searchbarContainer}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />
      </Header>
      <main>
        {searchResult?.tracks?.items && searchResult?.tracks?.items.length !== 0 && (
          <Songs data={searchResult?.tracks?.items || []} />
        )}
      </main>
    </>
  );
}

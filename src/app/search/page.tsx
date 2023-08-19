'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Searchbar from '@/components/Searchbar';
import styles from './page.module.scss';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import { fetchSearch } from '@/helpers/requests';
import Songs from '@/components/Songs';
import Link from 'next/link';
import Image from 'next/image';

let timeout: NodeJS.Timeout;
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useContext(SpotifyAccessContext);
  const [searchInput, setSearchInput] = useState(searchParams.get('value') || '');
  const [searchResult, setSearchResult] = useState<any>();

  const handleSearchbarSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearTimeout(timeout);
    router.replace(`/search?value=${searchInput}`);
  };

  useEffect(() => {
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
      fetchSearch(token, search).then((data) => setSearchResult(data));
    }
  }, [search, token]);

  const topResult = searchResult?.artists.items[0];

  console.log(topResult);
  return (
    <>
      <Header>
        <Searchbar
          classNameContainer={styles.searchbarContainer}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFormSubmit={handleSearchbarSubmit}
          onClear={() => setSearchInput('')}
        />
      </Header>
      <main>
        <div>
          {topResult && (
            <div>
              <h2>Top result</h2>
              <Link href={'artist/' + topResult.id}>
                <Image
                  src={topResult.images[1].url}
                  width={topResult.images[1].height}
                  height={topResult.images[1].height}
                  alt=""
                />
                <span>{topResult.name}</span>
                <span>Artist</span>
              </Link>
            </div>
          )}
          <div>
            <h2>Songs</h2>
            {searchResult?.tracks?.items &&
              searchResult?.tracks?.items.length !== 0 && (
                <Songs data={searchResult?.tracks?.items || []} />
              )}
          </div>
        </div>
      </main>
    </>
  );
}

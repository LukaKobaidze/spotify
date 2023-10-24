'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IconClear, IconSearch } from '@/icons';
import Tooltip from '@/components/Tooltip/Tooltip';
import styles from './Searchbar.module.scss';

interface Props {
  initialValue: string;
}

let routeSearchUpdateTimeout: NodeJS.Timeout;

export default function Searchbar(props: Props) {
  const { initialValue } = props;

  const router = useRouter();
  const [searchedValue, setSearchedValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchedValue.trim().length === 0) {
      router.replace('/search');
    } else {
      routeSearchUpdateTimeout = setTimeout(() => {
        router.replace(`/search?value=${searchedValue}`);
      }, 200);
    }

    return () => {
      clearTimeout(routeSearchUpdateTimeout);
    };
  }, [router, searchedValue]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submit');
    e.preventDefault();

    clearTimeout(routeSearchUpdateTimeout);
    router.replace(`/search?value=${searchedValue}`);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSearchSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        <IconSearch />
      </button>

      {searchedValue?.toString() && (
        <Tooltip text="Clear" showOnHover className={styles.clearButtonWrapper}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => {
              setSearchedValue('');
              inputRef.current?.focus();
            }}
          >
            <IconClear />
          </button>
        </Tooltip>
      )}
    </form>
  );
}

'use client';
import { IconClear, IconSearch } from '@/icons';
import styles from './Searchbar.module.scss';
import Tooltip from '../Tooltip';
import { useRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear?: () => void;
}

export default function Searchbar(props: Props) {
  const {
    classNameContainer,
    onFormSubmit,
    onClear,
    className,
    value,
    ...restProps
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className={`${styles.formContainer} ${classNameContainer || ''}`}
      onSubmit={onFormSubmit}
    >
      <input
        ref={inputRef}
        className={`${styles.input} ${className || ''}`}
        value={value}
        {...restProps}
      />
      <button type="submit" className={styles.searchButton}>
        <IconSearch />
      </button>

      {value?.toString() && (
        <Tooltip text="Clear" showOnHover className={styles.clearButtonWrapper}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => {
              onClear && onClear();
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

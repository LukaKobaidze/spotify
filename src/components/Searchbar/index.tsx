import { IconClear, IconSearch } from '@/icons';
import styles from './Searchbar.module.scss';
import Tooltip from '../Tooltip';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Searchbar(props: Props) {
  return (
    <form className={styles.formContainer}>
      <input className={styles.input} />
      <button type="submit" className={styles.searchButton}>
        <IconSearch />
      </button>
      <Tooltip text="Clear" showOnHover className={styles.clearButtonWrapper}>
        <button type="button" className={styles.clearButton}>
          <IconClear />
        </button>
      </Tooltip>
    </form>
  );
}

import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './loading.module.scss';

interface Props {}

export default function PageLoading(props: Props) {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <LoadingSpinner />
      </main>
    </>
  );
}

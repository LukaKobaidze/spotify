import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './loading.module.scss';

export default function PageLoading() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <LoadingSpinner />
      </main>
    </>
  );
}

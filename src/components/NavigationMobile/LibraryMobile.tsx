import { useContext } from 'react';
import styles from './LibraryMobile.module.scss';
import { LibraryContext } from '@/context/library.context';
import LibraryItem from '../LibraryItem';
import { IconClear } from '@/icons';

interface Props {
  onClose: () => void;
}

export default function LibraryMobile(props: Props) {
  const { onClose } = props;

  const { libraryItems, liked } = useContext(LibraryContext);

  return (
    <div className={styles.container}>
      <div className={styles.stickyTop}>
        <button className={styles.buttonClose} onClick={onClose}>
          <IconClear viewBox="0 0 24 24" className={styles.buttonCloseIcon} />
        </button>
        <h2 className={styles.heading}>Your Library</h2>
      </div>
      <div className={styles.wrapperFixed}>
        <LibraryItem
          data={{
            id: '',
            title: 'Liked Songs',
            trackLength: liked.length,
            type: 'playlist',
            image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
          }}
          linkHref="/liked"
          isExpanded
        />

        {libraryItems.map((item) => (
          <LibraryItem key={item.id} data={item} isExpanded />
        ))}
      </div>
    </div>
  );
}

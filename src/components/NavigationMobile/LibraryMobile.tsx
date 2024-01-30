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

  const { libraryItems } = useContext(LibraryContext);

  return (
    <div className={styles.container}>
      <div className={styles.stickyTop}>
        <button className={styles.buttonClose} onClick={onClose}>
          <IconClear viewBox="0 0 24 24" className={styles.buttonCloseIcon} />
        </button>
        <h2 className={styles.heading}>Your Library</h2>
      </div>
      <div className={styles.wrapperFixed}>
        {libraryItems.map((item) => (
          <LibraryItem key={item.id} data={item} isExpanded />
        ))}
      </div>
    </div>
  );
}

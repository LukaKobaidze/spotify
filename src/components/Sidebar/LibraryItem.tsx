import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { LibraryContext } from '@/context/library.context';
import { MenuContext } from '@/context/menu.context';
import { IconRemove } from '@/icons';
import Tooltip from '@/components/Tooltip';
import styles from './LibraryItem.module.scss';

export interface LibraryItemProps {
  data: {
    id: string;
    title: string;
    type: string;
    image: string;
    trackLength?: number;
  };
  isExpanded: boolean;
  linkHref?: string;
}

export default function LibraryItem(props: LibraryItemProps) {
  const { data, isExpanded, linkHref } = props;

  const { renderMenu } = useContext(MenuContext);
  const { onRemoveFromYourLibrary } = useContext(LibraryContext);

  const description = `${data.type[0].toUpperCase() + data.type.slice(1)}${
    data.type !== 'artist' ? ` • ${data.trackLength} songs` : ''
  }`;

  const handleItemRightClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    renderMenu({
      items: [
        {
          type: 'button',
          name: { Icon: IconRemove, text: 'Remove from Your Library' },
          action: () => onRemoveFromYourLibrary(data.id),
        },
      ],
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  return (
    <div className={`${styles.item} ${isExpanded ? styles.expanded : ''}`}>
      <Tooltip
        text={
          <div className={styles.tooltipText}>
            <div>{data.title}</div>
            <div className={styles.tooltipTextSub}>{description}</div>
          </div>
        }
        position="right"
        disabled={isExpanded}
      >
        <Link
          href={linkHref || `/${data.type}/${data.id}`}
          className={styles.itemAnchor}
          onContextMenu={handleItemRightClick}
        >
          <div className={styles.itemImageWrapper}>
            <Image
              src={data.image}
              alt=""
              fill
              sizes="100vw"
              className={`${styles.itemImage} ${
                data.type === 'artist' ? styles.itemImageArtist : ''
              }`}
            />
          </div>
          <div className={`${styles.tooltipText} ${styles.itemText}`}>
            <div className={`oneLinerEllipsis ${styles.itemTextName}`}>
              {data.title}
            </div>
            <div className={`oneLinerEllipsis ${styles.tooltipTextSub}`}>
              {description}
            </div>
          </div>
        </Link>
      </Tooltip>
    </div>
  );
}

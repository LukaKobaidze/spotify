'use client';
import Link from 'next/link';
import data from '@/data';
import { usePathname } from 'next/navigation';
import Tooltip from '../Tooltip';
import { IconFolderMusic } from '@/icons';
import styles from './Sidebar.module.scss';
import Image from 'next/image';
import { useContext } from 'react';
import { LibraryContext } from '@/context/library.context';

interface Props {
  className?: string;
}

export default function Sidebar(props: Props) {
  const { className } = props;

  const pathname = usePathname();
  const { liked } = useContext(LibraryContext);

  return (
    <aside className={`${styles.sidebar} ${className || ''}`}>
      <nav className={`roundedContainer ${styles.nav}`}>
        {data.mainNavigation.map(({ path, name, Icon, IconActive }) => {
          const isActive = pathname === path;

          return (
            <Tooltip key={path} text={name} position="right" offset={-6} showOnHover>
              <Link
                href={path}
                className={`textButton ${isActive ? 'textButtonActive' : ''}`}
              >
                {isActive ? (
                  <IconActive
                    className={`${styles.navIcon} ${styles[`navIcon${name}`]}`}
                  />
                ) : (
                  <Icon
                    className={`${styles.navIcon} ${styles[`navIcon${name}`]}`}
                  />
                )}
              </Link>
            </Tooltip>
          );
        })}
      </nav>
      <div className={`roundedContainer ${styles.library}`}>
        <Tooltip
          text="Expand Your Library"
          position="right"
          className={styles.sidebarExpandButtonWrapper}
          showOnHover
        >
          <button className={`textButton ${styles.sidebarExpandButton}`}>
            <IconFolderMusic />
          </button>
        </Tooltip>

        <Tooltip
          text={
            <div className={styles.libraryItemTooltipText}>
              <div>Liked Songs</div>
              <div className={styles.libraryItemTooltipTextSub}>Playlist • {liked.length} songs</div>
            </div>
          }
          position="right"
          showOnHover
        >
          <Link href={'/playlist/liked'} className={styles.libraryItemAnchor}>
            <Image
              src="https://misc.scdn.co/liked-songs/liked-songs-640.png"
              alt=""
              fill
              className={styles.libraryItemImage}
            />
          </Link>
        </Tooltip>
      </div>
    </aside>
  );
}

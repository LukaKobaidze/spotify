'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import data from '@/data';
import { usePathname } from 'next/navigation';
import Tooltip from '../Tooltip';
import { IconFolderMusic } from '@/icons';
import styles from './Sidebar.module.scss';
import Image from 'next/image';
import { useContext } from 'react';
import { LibraryContext } from '@/context/library.context';
import { LayoutContext } from '@/context/layout.context';

interface Props {
  className?: string;
}

export default function Sidebar(props: Props) {
  const { className } = props;

  const { updateSidebarSize } = useContext(LayoutContext);

  const pathname = usePathname();
  const { liked } = useContext(LibraryContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSize, setExpandedSize] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.pageX > 175) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }

      const sidebarSize = e.pageX - 7;

      if (sidebarSize > 279) {
        setExpandedSize(Math.min(sidebarSize, window.innerWidth - 416));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isResizing]);

  useEffect(() => {
    updateSidebarSize(sidebarRef.current?.clientWidth || 0);
  }, [isExpanded, expandedSize, updateSidebarSize]);

  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''} ${
        className || ''
      }`}
      style={isExpanded ? { width: expandedSize } : undefined}
      ref={sidebarRef}
    >
      <button
        className={`${styles.resize} ${isResizing ? styles.active : ''}`}
        onMouseDown={() => setIsResizing(true)}
      />
      <nav className={`roundedContainer ${styles.nav}`}>
        {data.mainNavigation.map(({ path, name, Icon, IconActive }) => {
          const isActive = pathname === path;

          return (
            <Tooltip
              key={path}
              text={name}
              position="right"
              offset={-6}
              showOnHover={!isExpanded}
            >
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
                <span className={styles.navLinkText}>{name}</span>
              </Link>
            </Tooltip>
          );
        })}
      </nav>
      <div className={`roundedContainer ${styles.library}`}>
        <Tooltip
          text={isExpanded ? 'Collapse Your Library' : 'Expand Your Library'}
          position={isExpanded ? 'top' : 'right'}
          className={styles.sidebarExpandButtonWrapper}
          showOnHover
        >
          <button
            className={`textButton ${styles.sidebarExpandButton}`}
            onClick={() => setIsExpanded((state) => !state)}
          >
            <IconFolderMusic />
            <span className={styles.sidebarExpandButtonText}>Your Library</span>
          </button>
        </Tooltip>

        <Tooltip
          text={
            <div className={styles.libraryItemTooltipText}>
              <div>Liked Songs</div>
              <div className={styles.libraryItemTooltipTextSub}>
                Playlist • {liked.length} songs
              </div>
            </div>
          }
          position="right"
          showOnHover={!isExpanded}
          className={styles.libraryItemAnchorWrapper}
        >
          <Link href={'/liked'} className={styles.libraryItemAnchor}>
            <div className={styles.libraryItemImageWrapper}>
              <Image
                src="https://misc.scdn.co/liked-songs/liked-songs-640.png"
                alt=""
                fill
                className={styles.libraryItemImage}
              />
            </div>
            <div
              className={`${styles.libraryItemTooltipText} ${styles.libraryItemText}`}
            >
              <div className={styles.libraryItemTextName}>Liked Songs</div>
              <div className={styles.libraryItemTooltipTextSub}>
                Playlist • {liked.length} songs
              </div>
            </div>
          </Link>
        </Tooltip>
      </div>
    </aside>
  );
}

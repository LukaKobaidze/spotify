'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import data from '@/data';
import { usePathname } from 'next/navigation';
import Tooltip from '../Tooltip/Tooltip';
import { IconFolderMusic } from '@/icons';
import styles from './Sidebar.module.scss';
import { useContext } from 'react';
import { LibraryContext } from '@/context/library.context';
import { LayoutContext } from '@/context/layout.context';
import LibraryItem from './LibraryItem';
import { TooltipAttribute } from '@/types';

interface Props {
  className?: string;
}

export default function Sidebar(props: Props) {
  const { className } = props;

  const { updateSidebarSize } = useContext(LayoutContext);

  const pathname = usePathname();
  const { liked, libraryItems } = useContext(LibraryContext);
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
            <Link
              key={path}
              href={path}
              className={`textButton ${isActive ? 'textButtonActive' : ''}`}
              tooltip={JSON.stringify({
                position: 'right',
                text: name,
                offset: 6,
              } as TooltipAttribute)}
            >
              {isActive ? (
                <IconActive
                  className={`${styles.navIcon} ${styles[`navIcon${name}`]}`}
                />
              ) : (
                <Icon className={`${styles.navIcon} ${styles[`navIcon${name}`]}`} />
              )}
              <span className={styles.navLinkText}>{name}</span>
            </Link>
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

        <div className={styles.libraryItemsWrapper}>
          <LibraryItem
            data={{
              id: '',
              title: 'Liked Songs',
              trackLength: liked.length,
              type: 'playlist',
              image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
            }}
            isExpanded={isExpanded}
            linkHref="/liked"
          />

          {libraryItems.map((item) => (
            <LibraryItem key={item.id} data={item} isExpanded={isExpanded} />
          ))}
        </div>
      </div>
    </aside>
  );
}

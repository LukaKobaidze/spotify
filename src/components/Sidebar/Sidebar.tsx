'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useContext } from 'react';
import { LibraryContext } from '@/context/library.context';
import { LayoutContext } from '@/context/layout.context';
import { IconFolderMusic } from '@/icons';
import data from '@/data';
import Tooltip from '@/components/Tooltip';
import LibraryItem from './LibraryItem';
import styles from './Sidebar.module.scss';
import { useLocalStorageState } from '@/hooks';

const SIDEBAR_EXPANDED_MIN = 280;
const MAINVIEW_SIZE_MIN = 416;

interface Props {
  className?: string;
}

export default function Sidebar(props: Props) {
  const { className } = props;

  const { windowSize, updateSidebarSize } = useContext(LayoutContext);

  const pathname = usePathname();
  const { liked, libraryItems } = useContext(LibraryContext);
  const [isExpanded, setIsExpanded] = useLocalStorageState('sidebar-expanded', true);
  const [expandedSize, setExpandedSize] = useLocalStorageState(
    'sidebar-size',
    SIDEBAR_EXPANDED_MIN
  );
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

      if (sidebarSize > SIDEBAR_EXPANDED_MIN - 1) {
        setExpandedSize(
          Math.min(sidebarSize, window.innerWidth - MAINVIEW_SIZE_MIN)
        );
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (isExpanded) {
          setExpandedSize((expandedSizeState) =>
            Math.min(expandedSizeState + 10, window.innerWidth - MAINVIEW_SIZE_MIN)
          );
        } else {
          setIsExpanded(true);
        }
      } else if (e.key === 'ArrowLeft' && isExpanded) {
        setExpandedSize((state) => {
          const stateNext = state - 10;

          if (stateNext < SIDEBAR_EXPANDED_MIN) {
            setIsExpanded(false);
            return SIDEBAR_EXPANDED_MIN;
          }

          return stateNext;
        });
      }
    };

    const handleResize = () => {
      setExpandedSize((state) => {
        const min = window.innerWidth - MAINVIEW_SIZE_MIN;

        if (min < SIDEBAR_EXPANDED_MIN) {
          setIsExpanded(false);
          return min;
        }

        return Math.min(state, min);
      });
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('keydown', handleKeyDown);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isResizing, isExpanded, setExpandedSize, setIsExpanded]);

  useEffect(() => {
    updateSidebarSize(sidebarRef.current?.clientWidth || 0);
  }, [isExpanded, expandedSize, updateSidebarSize]);

  if (windowSize <= 575) return null;
  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''} ${
        className || ''
      }`}
      style={isExpanded ? { width: expandedSize } : undefined}
      ref={sidebarRef}
    >
      <nav className={`roundedContainer ${styles.nav}`}>
        {data.mainNavigation.map(({ path, name, Icon, IconActive }) => {
          const isActive = pathname === path;

          return (
            <Tooltip key={path} text={name} position="right" disabled={isExpanded}>
              <Link
                href={path}
                className={`textButton ${isActive ? 'textButtonActive' : ''} ${
                  styles.navLink
                }`}
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
        <div className={styles.sidebarExpandButtonWrapper}>
          <Tooltip
            text={isExpanded ? 'Collapse Your Library' : 'Expand Your Library'}
            position={isExpanded ? 'top' : 'right'}
          >
            <button
              className={`textButton ${styles.sidebarExpandButton}`}
              onClick={() =>
                setIsExpanded((state) =>
                  window.innerWidth < SIDEBAR_EXPANDED_MIN + MAINVIEW_SIZE_MIN
                    ? false
                    : !state
                )
              }
            >
              <IconFolderMusic />
              <span className={styles.sidebarExpandButtonText}>Your Library</span>
            </button>
          </Tooltip>
        </div>

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
      {typeof window !== 'undefined' &&
        window.innerWidth >= SIDEBAR_EXPANDED_MIN + MAINVIEW_SIZE_MIN && (
          <button
            className={`${styles.resize} ${isResizing ? styles.active : ''}`}
            onMouseDown={() => setIsResizing(true)}
            onFocus={() => setIsResizing(true)}
            onBlur={() => setIsResizing(false)}
          />
        )}
    </aside>
  );
}

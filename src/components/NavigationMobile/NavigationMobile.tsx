'use client';
import Link from 'next/link';
import styles from './NavigationMobile.module.scss';
import { IconFolderMusic } from '@/icons';
import { usePathname } from 'next/navigation';
import data from '@/data';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/context/layout.context';
import LibraryMobile from './LibraryMobile';
import { createPortal } from 'react-dom';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function FooterMobile(props: Props) {
  const { className, ...restProps } = props;

  const { windowSize } = useContext(LayoutContext);
  const pathname = usePathname();

  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    if (windowSize <= 575 && showLibrary) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showLibrary, windowSize]);

  useEffect(() => {
    setShowLibrary(false);
  }, [pathname]);

  const iconProps = {
    '/': {
      viewBox: '0 0 46 46',
      className: styles.icon,
    },
    '/search': {
      viewBox: '0 0 50 50',
      className: styles.icon,
    },
  };

  if (windowSize > 575) return null;
  return (
    <nav className={`${styles.nav} ${className || ''}`}>
      <div className={styles.contentWrapper}>
        {data.mainNavigation.map(({ path, name, Icon, IconActive }) => {
          const isActive = pathname === path && !showLibrary;

          return (
            <Link
              key={path}
              href={path}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={pathname === path ? () => setShowLibrary(false) : undefined}
            >
              {isActive ? (
                <IconActive {...iconProps[path]} />
              ) : (
                <Icon {...iconProps[path]} />
              )}
              <span>{name}</span>
            </Link>
          );
        })}
        <button
          className={`${styles.item} ${showLibrary ? styles.active : ''}`}
          onClick={() => setShowLibrary(true)}
        >
          <IconFolderMusic viewBox="0 0 21 21" className={styles.icon} />
          <span>Your Library</span>
        </button>
      </div>
      {showLibrary &&
        (createPortal(
          <LibraryMobile onClose={() => setShowLibrary(false)} />,
          document.body
        ) as React.ReactNode)}
    </nav>
  );
}

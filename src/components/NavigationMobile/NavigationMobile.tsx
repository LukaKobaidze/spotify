'use client';
import Link from 'next/link';
import styles from './NavigationMobile.module.scss';
import {
  IconFolderMusic,
  IconHome,
  IconHomeFill,
  IconSearch,
  IconSearchFill,
} from '@/icons';
import { usePathname } from 'next/navigation';
import data from '@/data';
import { useContext } from 'react';
import { LayoutContext } from '@/context/layout.context';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function FooterMobile(props: Props) {
  const { className, ...restProps } = props;

  const { windowSize } = useContext(LayoutContext);
  const pathname = usePathname();

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
          const isActive = pathname === path;

          return (
            <Link
              key={path}
              href={path}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
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
        <button className={styles.item}>
          <IconFolderMusic viewBox="0 0 21 21" className={styles.icon} />
          <span>Your Library</span>
        </button>
      </div>
    </nav>
  );
}

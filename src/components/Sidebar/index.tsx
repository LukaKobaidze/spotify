'use client';
import Link from 'next/link';
import data from '@/data';
import { usePathname } from 'next/navigation';
import Tooltip from '../Tooltip';
import styles from './Sidebar.module.scss';

interface Props {}

export default function Sidebar(props: Props) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav className={`roundedContainer ${styles.nav}`}>
        {data.mainNavigation.map(({ path, name, Icon, IconActive }) => {
          const isActive = pathname === path

          return (
            <Tooltip key={path} text={name} position="right" offset={-6} showOnHover>
              <Link href={path} className={`textButton ${isActive ? 'textButtonActive' : ''}`}>
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
    </aside>
  );
}

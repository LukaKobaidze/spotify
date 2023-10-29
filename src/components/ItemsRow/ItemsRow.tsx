'use client';
import { useContext, useMemo } from 'react';
import { LayoutContext } from '@/context/layout.context';
import styles from './ItemsRow.module.scss';
import Link from 'next/link';

interface Props {
  children: (renderAmount: number) => React.ReactNode[];
  heading?: string;
  anchor?: { name: string; href: string };
  className?: string;
}

export default function ItemsRow(props: Props) {
  const { children, heading, anchor, className } = props;

  const { mainViewSize } = useContext(LayoutContext);

  const renderAmount = Math.floor(mainViewSize / 180);

  const renderChildren = useMemo(() => {
    return children(renderAmount);
  }, [children, renderAmount]);

  return (
    <div className={className || ''}>
      {heading && (
        <div className={styles.header}>
          <h2 className={styles.heading}>{heading}</h2>

          {anchor && (
            <Link href={anchor.href} className={styles.headerAnchor}>
              {anchor.name}
            </Link>
          )}
        </div>
      )}
      <div className={styles.items}>{renderChildren}</div>
    </div>
  );
}

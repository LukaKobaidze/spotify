'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IconKeyboardArrowLeft, IconKeyboardArrowRight } from '@/icons';
import Tooltip from '@/components/Tooltip';
import styles from './Header.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  backgroundOpacity?: number;
  backgroundAppearOnScroll?: boolean;
}

export default function Header(props: Props) {
  const {
    backgroundOpacity,
    backgroundAppearOnScroll,
    className,
    children,
    ...restProps
  } = props;

  const router = useRouter();

  const headerRef = useRef<HTMLElement>(null);
  const [headerBgOpacity, setHeaderBgOpacity] = useState(
    backgroundAppearOnScroll ? 0 : 1
  );

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const scrollingElement = e.target as HTMLElement | null;

      if (headerRef.current && scrollingElement) {
        setHeaderBgOpacity(
          Math.min(scrollingElement.scrollTop / headerRef.current.clientHeight, 1)
        );
      }
    };

    const mainView = document.getElementById('main-view');

    if (mainView && backgroundAppearOnScroll) {
      setHeaderBgOpacity(0);
      mainView.addEventListener('scroll', handleScroll);
    } else {
      setHeaderBgOpacity(1);
    }

    return () => {
      mainView?.removeEventListener('scroll', handleScroll);
    };
  }, [backgroundAppearOnScroll]);

  return (
    <header
      className={`contentPadding ${styles.header} ${className || ''}`}
      ref={headerRef}
      {...restProps}
    >
      <div
        className={styles.headerBackground}
        style={{
          backgroundColor: backgroundOpacity
            ? `rgba(0, 0, 0, ${backgroundOpacity})`
            : undefined,
          opacity: headerBgOpacity,
        }}
      />
      <div className={styles.history}>
        <Tooltip text="Go back" position="bottom">
          <button className={styles.historyButton} onClick={() => router.back()}>
            <IconKeyboardArrowLeft />
          </button>
        </Tooltip>
        <Tooltip text="Go forward" position="bottom">
          <button className={styles.historyButton} onClick={() => router.forward()}>
            <IconKeyboardArrowRight />
          </button>
        </Tooltip>
      </div>
      {children}
    </header>
  );
}

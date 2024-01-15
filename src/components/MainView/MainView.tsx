'use client';
import { useContext, useEffect, useRef } from 'react';
import { LayoutContext } from '@/context/layout.context';
import styles from './MainView.module.scss';

interface Props {
  children: React.ReactNode;
}

export default function MainView({ children }: Props) {
  const { sidebarSize, updateMainViewSize } = useContext(LayoutContext);

  const mainViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      updateMainViewSize(mainViewRef.current?.clientWidth || 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarSize, updateMainViewSize]);

  return (
    <div id="main-view" className={`roundedContainer ${styles.mainView}`} ref={mainViewRef}>
      {children}
    </div>
  );
}

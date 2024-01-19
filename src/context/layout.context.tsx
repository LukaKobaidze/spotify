'use client';
import { createContext, useCallback, useEffect, useState } from 'react';

interface Context {
  windowSize: number;
  sidebarSize: number;
  mainViewSize: number;
  updateSidebarSize: (size: number) => void;
  updateMainViewSize: (size: number) => void;
}

const initial: Context = {
  windowSize: typeof window === 'undefined' ? 0 : window.innerWidth,
  sidebarSize: 0,
  mainViewSize: 0,
  updateSidebarSize: () => {},
  updateMainViewSize: () => {},
};

export const LayoutContext = createContext(initial);

export function LayoutContextProvider({ children }: { children: React.ReactNode }) {
  const [windowSize, setWindowSize] = useState(initial.windowSize);
  const [sidebarSize, setSidebarSize] = useState(initial.sidebarSize);
  const [mainViewSize, setMainViewSize] = useState(initial.mainViewSize);

  const updateSidebarSize: Context['updateSidebarSize'] = useCallback((size) => {
    setSidebarSize(size);
  }, []);

  const updateMainViewSize: Context['updateMainViewSize'] = useCallback((size) => {
    setMainViewSize(size);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        windowSize,
        sidebarSize,
        mainViewSize,
        updateSidebarSize,
        updateMainViewSize,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

'use client';
import { createContext, useCallback, useState } from 'react';

interface Context {
  sidebarSize: number;
  mainViewSize: number;
  updateSidebarSize: (size: number) => void;
  updateMainViewSize: (size: number) => void;
}

const initial: Context = {
  sidebarSize: 0,
  mainViewSize: 0,
  updateSidebarSize: () => {},
  updateMainViewSize: () => {},
};

export const LayoutContext = createContext(initial);

export function LayoutContextProvider({ children }: { children: React.ReactNode }) {
  const [sidebarSize, setSidebarSize] = useState(initial.sidebarSize);
  const [mainViewSize, setMainViewSize] = useState(initial.mainViewSize);

  const updateSidebarSize: Context['updateSidebarSize'] = useCallback((size) => {
    setSidebarSize(size);
  }, []);

  const updateMainViewSize: Context['updateMainViewSize'] = useCallback((size) => {
    setMainViewSize(size);
  }, []);

  return (
    <LayoutContext.Provider
      value={{ sidebarSize, mainViewSize, updateSidebarSize, updateMainViewSize }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

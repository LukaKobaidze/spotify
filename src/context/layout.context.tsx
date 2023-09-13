'use client';
import { createContext, useCallback, useState } from 'react';

interface Context {
  sidebarSize: number;
  updateSidebarSize: (width: number) => void;
}

const initial: Context = {
  sidebarSize: 0,
  updateSidebarSize: () => {},
};

export const LayoutContext = createContext(initial);

export function LayoutContextProvider({ children }: { children: React.ReactNode }) {
  const [sidebarSize, setsidebarSize] = useState(initial.sidebarSize);

  const updateSidebarSize: Context['updateSidebarSize'] = useCallback((width) => {
    setsidebarSize(width);
  }, []);

  return (
    <LayoutContext.Provider value={{ sidebarSize, updateSidebarSize }}>
      {children}
    </LayoutContext.Provider>
  );
}

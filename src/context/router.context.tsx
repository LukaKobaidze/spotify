'use client';
import { useRouter, usePathname } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

interface Context {
  routeAvailable: { back: boolean; forward: boolean };
  onRouteGoBack: () => void;
  onRouteGoForward: () => void;
}

const initial: Context = {
  routeAvailable: { back: false, forward: false },
  onRouteGoBack: () => {},
  onRouteGoForward: () => {},
};

export const RouterContext = createContext(initial);

let isInitialRender = true;
let ignorePathnameChange = false;
let initialRoutesLength = 0;
let currentRouteIndex = 0;
export function RouterContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [routeAvailable, setRouteAvailable] = useState(initial.routeAvailable);

  useEffect(() => {
    initialRoutesLength = window.history.length;
    currentRouteIndex = window.history.length;

    window.onpopstate = (e) => {
      if (ignorePathnameChange) return;

      setRouteAvailable({ back: false, forward: false });
      initialRoutesLength = window.history.length;
      currentRouteIndex = window.history.length;
      updateAvailableRoutes();
    };
  }, []);

  const updateAvailableRoutes = () => {
    setRouteAvailable({
      back: initialRoutesLength !== currentRouteIndex,
      forward: currentRouteIndex !== window.history.length,
    });
  };

  const onRouteGoBack: Context['onRouteGoBack'] = () => {
    if (!routeAvailable.back) return;

    router.back();
    currentRouteIndex--;
    ignorePathnameChange = true;

    updateAvailableRoutes();
  };

  const onRouteGoForward: Context['onRouteGoForward'] = () => {
    if (!routeAvailable.forward) return;

    router.forward();
    currentRouteIndex++;
    ignorePathnameChange = true;

    updateAvailableRoutes();
  };

  useEffect(() => {
    if (ignorePathnameChange) {
      ignorePathnameChange = false;
    } else {
      currentRouteIndex = Math.min(currentRouteIndex + 1, window.history.length);
      updateAvailableRoutes();
    }
    isInitialRender = false;
  }, [pathname]);

  return (
    <RouterContext.Provider
      value={{ routeAvailable, onRouteGoBack, onRouteGoForward }}
    >
      {children}
    </RouterContext.Provider>
  );
}

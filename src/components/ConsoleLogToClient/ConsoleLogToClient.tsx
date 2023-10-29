'use client';

import { useEffect } from 'react';

type Props = { [key: string]: any };

export default function ConsoleLogToClient(props: Props) {
  useEffect(() => {
    const keys = Object.keys(props);

    keys.forEach((key) => {
      console.log(`${key}: `, props[key]);
    });
  }, [props]);

  return null;
}

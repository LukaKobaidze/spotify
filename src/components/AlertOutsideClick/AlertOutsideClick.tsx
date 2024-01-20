'use client';
import React, { useEffect, useRef } from 'react';

interface Props {
  event: 'click' | 'mousedown';
  onOutsideClick: () => void;
  children: React.ReactElement;
  handleWhen?: boolean;
  ignore?: React.RefObject<Element>[];
}

export default function AlertOutsideClick(props: Props) {
  const { event, ignore, handleWhen = true, onOutsideClick, children } = props;

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      if (
        !ref.current?.contains(target) &&
        (!ignore || ignore.every((ref) => !ref.current?.contains(target)))
      ) {
        onOutsideClick();
      }
    };

    if (handleWhen) {
      document.addEventListener(event, handleEvent);
    } else {
      document.removeEventListener(event, handleEvent);
    }

    return () => document.removeEventListener(event, handleEvent);
  }, [handleWhen, onOutsideClick, ignore, event]);

  return React.Children.map(children, (child: any) =>
    React.cloneElement(child, {
      ref: (ref: any) => (ref = { current: ref }),
    })
  );
}

'use client';

import { TooltipAttribute } from '@/types';
import { useEffect, useState } from 'react';

interface Props {}

export default function GlobalTooltipHandler(props: Props) {
  const [tooltipState, setTooltipState] = useState<
    (TooltipAttribute & { windowPos: { x: Number; y: number } }) | null
  >(null);

  useEffect(() => {
    const elements = document.querySelectorAll('[tooltip]');

    elements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        setTooltipState(JSON.parse(element.getAttribute('tooltip')!));
      });
      element.addEventListener('mouseleave', () => {
        setTooltipState(null);
      })
    });
  }, []);

  return null;
}

'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.scss';

interface Props {
  text: string | React.ReactNode;
  position: 'top' | 'right' | 'bottom' | 'left';

  /*`offset` - 6 by default */
  children: React.ReactElement;
  offset?: number;
  disabled?: boolean;
}

export default function Tooltip(props: Props) {
  const { text, position, offset = 6, children, disabled } = props;

  const childrenRef = useRef<HTMLElement>();

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const element = childrenRef.current;

    if (!element) return;

    let delayTimeout: NodeJS.Timeout;
    const handleMouseEnter = () => {
      delayTimeout = setTimeout(() => {
        setShowTooltip(true);
      }, 150);
    };
    const handleMouseLeave = () => {
      clearTimeout(delayTimeout);
      setShowTooltip(false);
    };

    if (!disabled) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearTimeout(delayTimeout);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [position, disabled]);

  const tooltipStyleVariables = useMemo(() => {
    const element = childrenRef.current;

    if (showTooltip && element) {
      const rect = element.getBoundingClientRect();

      switch (position) {
        case 'top':
          return {
            '--pos-x': rect.right - element.clientWidth / 2 + 'px',
            '--pos-y': rect.top - offset + 'px',
          };
        case 'right':
          return {
            '--pos-x': rect.right + offset + 'px',
            '--pos-y': rect.bottom - element.clientHeight / 2 + 'px',
          };
        case 'bottom':
          return {
            '--pos-x': rect.right - element.clientWidth / 2 + 'px',
            '--pos-y': rect.bottom + offset + 'px',
          };
        case 'left':
          return {
            '--pos-x': rect.left - offset + 'px',
            '--pos-y': rect.bottom - element.clientHeight / 2 + 'px',
          };
      }
    }
  }, [showTooltip, position, offset]) as React.CSSProperties | undefined;

  return (
    <>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          ref: (ref: any) => (childrenRef.current = ref),
        })
      )}

      {tooltipStyleVariables &&
        createPortal(
          <div
            className={`${styles.tooltip} ${styles[`tooltip--${position}`]}`}
            style={tooltipStyleVariables}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

'use client';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';
import { MenuContext } from '@/context/menu.context';
import { IconSquare } from '@/icons';
import styles from './Menu.module.scss';

export interface MenuProps {
  items: ({ name: { Icon?: any; text: string } } & (
    | {
        type: 'button';
        action: () => void;
      }
    | { type: 'link'; href: string }
  ))[];
  windowPos: { x: number; y: number };
}

export default function Menu(props: MenuProps) {
  const { items, windowPos } = props;

  const { removeMenu } = useContext(MenuContext);
  const [windowPosRendered, setWindowPosRendered] = useState(windowPos);
  const [directionChecked, setDirectionChecked] = useState(false);

  useEffect(() => {
    setDirectionChecked(false);
  }, [windowPos]);

  const iconProps: any = {
    className: styles.itemIcon,
    width: '22',
    height: '22',
  };
  const textProps: React.HTMLAttributes<HTMLSpanElement> = {
    className: styles.itemText,
  };

  return (
    <ul
      className={styles.container}
      ref={(node) => {
        if (directionChecked || !node) return;
        setDirectionChecked(true);

        setWindowPosRendered(() => {
          // If menu is overflowing from window
          const copy = { ...windowPos };

          if (window.innerWidth < windowPos.x + node.clientWidth) {
            copy.x -= node.clientWidth;
          }
          if (window.innerHeight < windowPos.y + node.clientHeight) {
            copy.y -= node.clientHeight;
          }

          return copy;
        });
      }}
      style={{
        transform: `translate(${windowPosRendered.x}px, ${windowPosRendered.y}px)`,
      }}
    >
      {items.map((item) => (
        <li key={item.name.text}>
          {item.type === 'link' ? (
            <Link
              key={item.name.text}
              href={item.href}
              className={styles.item}
              onClick={removeMenu}
            >
              {item.name.Icon ? (
                <item.name.Icon {...iconProps} />
              ) : (
                <IconSquare {...iconProps} />
              )}
              <span {...textProps}>{item.name.text}</span>
            </Link>
          ) : (
            <button
              className={styles.item}
              onClick={(e) => {
                item.action();
                removeMenu();
              }}
            >
              {item.name.Icon ? (
                <item.name.Icon {...iconProps} />
              ) : (
                <IconSquare {...iconProps} />
              )}
              <span {...textProps}>{item.name.text}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

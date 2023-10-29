'use client';
import { useContext, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Menu.module.scss';
import { MenuContext } from '@/context/menu.context';
import { IconSquare } from '@/icons';

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

        setWindowPosRendered((state) => {
          // Fix if menu is overflowing from window
          const copy = { ...state };

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

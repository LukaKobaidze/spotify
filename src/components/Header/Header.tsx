'use client';
import { useRouter } from 'next/navigation';
import { IconKeyboardArrowLeft, IconKeyboardArrowRight } from '@/icons';
import Tooltip from '@/components/Tooltip';
import styles from './Header.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  backgroundOpacity?: number;
}

export default function Header(props: Props) {
  const { backgroundOpacity, className, children, ...restProps } = props;

  const router = useRouter();

  return (
    <header
      className={`contentPadding ${styles.header} ${className || ''}`}
      style={
        backgroundOpacity
          ? { backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }
          : undefined
      }
      {...restProps}
    >
      <div className={styles.history}>
        <Tooltip text="Go back" position="bottom">
          <button className={styles.historyButton} onClick={() => router.back()}>
            <IconKeyboardArrowLeft />
          </button>
        </Tooltip>
        <Tooltip text="Go forward" position="bottom">
          <button className={styles.historyButton} onClick={() => router.forward()}>
            <IconKeyboardArrowRight />
          </button>
        </Tooltip>
      </div>
      {children}
    </header>
  );
}

'use client';
import { IconKeyboardArrowLeft, IconKeyboardArrowRight } from '@/icons';
import { useRouter } from 'next/navigation';
import Tooltip from '../Tooltip/Tooltip';
import styles from './Header.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
}

export default function Header(props: Props) {
  const { className, children, ...restProps } = props;

  const router = useRouter();

  return (
    <header className={`contentPadding ${styles.header} ${className || ''}`} {...restProps}>
      <div className={styles.history}>
        <Tooltip text="Go back" showOnHover>
          <button className={styles.historyButton} onClick={() => router.back()}>
            <IconKeyboardArrowLeft />
          </button>
        </Tooltip>
        <Tooltip text="Go forward" showOnHover>
          <button className={styles.historyButton} onClick={() => router.forward()}>
            <IconKeyboardArrowRight />
          </button>
        </Tooltip>
      </div>
      {children}
    </header>
  );
}

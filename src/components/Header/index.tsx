'use client';
import { IconKeyboardArrowLeft, IconKeyboardArrowRight } from '@/icons';
import { useRouter } from 'next/navigation'
import Tooltip from '../Tooltip';
import styles from './Header.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header(props: Props) {
  const { className, children, ...restProps } = props;

  const router = useRouter();

  console.log(window.history);

  return (
    <header className={`${styles.header} ${className || ''}`} {...restProps}>
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

'use client';
import { useRouter } from 'next/navigation';
import { IconKeyboardArrowLeft, IconKeyboardArrowRight } from '@/icons';
import TooltipNew from '../Tooltip';
import styles from './Header.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header(props: Props) {
  const { className, children, ...restProps } = props;

  const router = useRouter();

  return (
    <header
      className={`contentPadding ${styles.header} ${className || ''}`}
      {...restProps}
    >
      <div className={styles.history}>
        <TooltipNew text="Go back" position="bottom">
          <button className={styles.historyButton} onClick={() => router.back()}>
            <IconKeyboardArrowLeft />
          </button>
        </TooltipNew>
        <TooltipNew text="Go forward" position="bottom">
          <button className={styles.historyButton} onClick={() => router.forward()}>
            <IconKeyboardArrowRight />
          </button>
        </TooltipNew>
      </div>
      {children}
    </header>
  );
}

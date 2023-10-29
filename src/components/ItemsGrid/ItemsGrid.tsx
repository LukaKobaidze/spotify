import React from 'react';
import styles from './ItemsGrid.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function ItemsGrid(props: Props) {
  const { children, className, ...restProps } = props;

  return (
    <div className={`${styles.container} ${className || ''}`} {...restProps}>
      {children}
    </div>
  );
}

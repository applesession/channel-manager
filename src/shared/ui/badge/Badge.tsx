import type React from 'react';
import styles from './Badge.module.scss';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  color: 'green' | 'orange' | 'red';
}

export function Badge({ children, color }: Props) {
  return (
    <div
      className={clsx(styles.badge, {
        [styles.green]: color === 'green',
        [styles.orange]: color === 'orange',
        [styles.red]: color === 'red',
      })}
    >
      {children}
    </div>
  );
}

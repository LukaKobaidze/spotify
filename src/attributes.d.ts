import 'react';

declare module 'react' {
  export interface HTMLAttributes<T> {
    tooltip?: string;
  }
}

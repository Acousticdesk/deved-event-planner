import { Header } from './Header.tsx';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

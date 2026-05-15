import type { JSX } from 'react';
import { Link, ROUTES } from '@/lib/router';

export function NotFoundPage(): JSX.Element {
  return (
    <main>
      <h1 style={{ fontSize: '6rem', margin: '1rem 0' }}>404</h1>
      <h2>页面未找到</h2>
      <p>您寻找的页面就像 Fblthp 一样丢失了。</p>
      <p>
        <Link href={ROUTES.home.path}>Back to home</Link>
      </p>
    </main>
  );
}

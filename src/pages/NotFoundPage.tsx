import type { JSX } from 'react';
import { Link, ROUTES } from '@/lib/router';

export function NotFoundPage(): JSX.Element {
  return (
    <main>
      <div style={{ padding: '0.5rem', textAlign: 'center' }}>
        <h2 style={{ padding: '0.5rem', marginBottom: '0.5rem', fontSize: '10rem' }}>404</h2>
        <h4 style={{ padding: '0.5rem' }}>页面未找到</h4>
      </div>
      <div style={{ padding: '0.5rem', textAlign: 'center' }}>
        <h4 style={{ padding: '0.5rem' }}>您寻找的页面就像Fblthp一样丢失了。</h4>
        <p style={{ padding: '0.5rem' }}>
          <Link href={ROUTES.home.path}>返回主页</Link>
        </p>
      </div>
    </main>
  );
}

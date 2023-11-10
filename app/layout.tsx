import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AuthProvider from './(components)/auth-provider';

import './globals.css';
import Nav from './(components)/nav';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next 14 next-auth',
  description: 'Auth system in Next.js 14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <AuthProvider>
        <body
          // className={`${inter.className} bg-gray-100`}
          className='bg-gray-100'
        >
          <Nav />
          <div className='m-2'>{children}</div>
        </body>
      </AuthProvider>
    </html>
  );
}

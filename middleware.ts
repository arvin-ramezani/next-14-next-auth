import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token?.role);

    if (
      req.nextUrl.pathname.startsWith('/create-user') &&
      req.nextauth.token?.role != 'admin'
    ) {
      return NextResponse.rewrite(new URL('/denied', req.url));
    }

    // if (
    //   req.nextUrl.pathname.startsWith('/signup') &&
    //   Boolean(req.nextauth.token)
    // ) {
    //   console.log('signup middleware');
    //   return NextResponse.redirect('/');
    // }
  },

  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ['/create-user'] };

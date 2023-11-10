import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email?: string;
      id?: string;
      role?: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

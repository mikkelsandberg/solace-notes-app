import { getUser } from '@/app/db';
import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const {email, password} = credentials;

        if (!email) {
          throw new Error('email is required');
        } else if (typeof email !== 'string') {
          throw new Error('email is invalid');
        } else if (!password) {
          throw new Error('password is required');
        } else if (typeof password !== 'string') {
          throw new Error('password is invalid');
        }

        user = await getUser(email);
        
        if (user.length === 0) {
          throw new Error('email and password do not match');
        }
        
        const passwordsMatch = await compare(password, user[0].password!);
        
        if (!passwordsMatch) {
          throw new Error('email and password do not match');
        }

        return user[0] as any;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnNotes = nextUrl.pathname.startsWith('/notes');

      if (isOnNotes) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL('/login', nextUrl)); // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/notes', nextUrl));
      }

      return true;
    },
  },
});
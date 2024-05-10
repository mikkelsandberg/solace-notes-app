import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
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
} satisfies NextAuthConfig;

import { authConfig } from '@/auth.config';
import { getUser } from '@/db/schema/users';
import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const {username, password} = credentials;

        if (!username) {
          throw new Error('username is required');
        } else if (typeof username !== 'string') {
          throw new Error('username is invalid');
        } else if (!password) {
          throw new Error('password is required');
        } else if (typeof password !== 'string') {
          throw new Error('password is invalid');
        }

        user = await getUser(username);
        
        if (user.length === 0) {
          throw new Error('username and password do not match');
        }
        
        const passwordsMatch = await compare(password, user[0].password!);
        
        if (!passwordsMatch) {
          throw new Error('username and password do not match');
        }

        return user[0] as any;
      },
    }),
  ],
});
'use server';

import { signIn, signOut } from '@/auth';

export const login = async (formData: FormData) => {
  await signIn('credentials', {
    redirectTo: '/notes',
    username: formData.get('username') as string,
    password: formData.get('password') as string,
  });
};

export const logout = async () => {
  await signOut({
    redirectTo: '/login',
  });
};
'use server';

import { signIn } from "@/auth";

export const handleLogin = async (formData: FormData) => {
  await signIn('credentials', {
    redirectTo: '/notes',
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
};
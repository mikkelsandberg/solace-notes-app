import { User } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useLoggedInUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (session?.user) {
        setUser(session.user);
      }
    };

    fetchSession();
  }, []);

  return { user };
};
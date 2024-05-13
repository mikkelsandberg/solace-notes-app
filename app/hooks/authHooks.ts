import { User } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useLoggedInUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoadingUser(true);

      const session = await getSession();

      if (session?.user) {
        setUser(session.user);
      }

      setLoadingUser(false);
    };

    fetchSession();
  }, []);

  return { loadingUser, user };
};
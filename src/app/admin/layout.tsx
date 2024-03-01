'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Spinner } from '@nextui-org/react';
import { useEffect } from 'react';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.push('/');
    }
  }, [router, loggedIn, loading]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner size='md' />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner size='md' />
      </div>
    );
  }

  return (
    <div className='h-full'>
      <Navbar />
      <div className='h-full py-12 max-w-[120ch] mx-auto'>
        <div className='h-full mx-8 md:mx-16'>{children}</div>
      </div>
    </div>
  );
};

export default ProtectedLayout;

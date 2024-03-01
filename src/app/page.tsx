// app/page.tsx
'use client';

import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { useEffect, useState } from 'react';
import { EyeFilledIcon } from '@/ui/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/ui/EyeSlashFilledIcon';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const { login, loggedIn, loading, error } = useAuth();
  const router = useRouter();

  const loginHandler = () => {
    login(email, password);
  };

  useEffect(() => {
    if (!loading && loggedIn) {
      router.push('/admin');
    }
  }, [router, loggedIn, loading]);

  if (loggedIn) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner size='md' />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-full'>
      <Card className='w-11/12 md:w-1/2 lg:w-1/3 mx-auto'>
        <CardBody className='mx-auto'>
          <p className='text-2xl font-bold mx-auto text-center my-2'>Login</p>
          <div className='mx-auto w-11/12'>
            <Input className={'my-3'} size={'sm'} type='email' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={'my-3'}
              size={'sm'}
              label='Password'
              endContent={
                <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                  ) : (
                    <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                  )}
                </button>
              }
              type={isVisible ? 'text' : 'password'}
            />
          </div>

          <Button className='w-1/2 my-3 mx-auto' color='primary' size='md' variant='solid' onClick={loginHandler} isLoading={loading}>
            Login
          </Button>
          {error && <p className='w-full text-center mx-auto text-red-400'>{error}</p>}
        </CardBody>
      </Card>
    </div>
  );
}

import Image from 'next/image';
import React from 'react';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative h-full'>
      <div className='fixed inset-0 z-[-1]'>
        <Image src='/bg.webp' alt='Background image' fill className='object-cover' />
      </div>
      <div className='py-12 max-w-[120ch] mx-auto h-full relative'>
        <div className='mx-8 md:mx-16 h-full'>{children}</div>
      </div>
    </div>
  );
};

export default BaseLayout;

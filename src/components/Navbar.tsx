'use client';

import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import { usePathname } from 'next/navigation';
// import LogoImage from '@/../public/logo.png';
import Image from 'next/image';

const LINKS = [
  { name: 'Home', href: '/admin' },
  { name: 'Registration', href: '/admin/registration' },
  { name: 'Gate', href: '/admin/gate' },
  { name: 'Replace', href: '/admin/replace' },
];

// const Logo = () => (
//   <span className='relative w-20 h-20'>
//     <Image fill={true} src={LogoImage} alt='RSL Logo' className='object-contain' />
//   </span>
// );

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar position='sticky' className='h-20' maxWidth='xl' onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className='sm:hidden'>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className='sm:hidden' />
        <Link href='/' color='foreground' className='sm:block hidden'>
          <NavbarBrand>{/* <Logo /> */}</NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-8' justify='center'>
        {LINKS.map((link) => (
          <NavbarItem key={link.href}>
            <Link color={pathname === link.href ? 'secondary' : 'foreground'} className='font-medium' href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu className='mt-2 from-black to-black/40 bg-gradient-to-b'>
        {LINKS.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link color={pathname === link.href ? 'secondary' : 'foreground'} className='w-full my-2' href={link.href} size='lg'>
              {link.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

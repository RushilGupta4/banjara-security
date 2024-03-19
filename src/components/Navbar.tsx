'use client';

import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@nextui-org/navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import LogoImage from '@/../public/logo.png';
import Image from 'next/image';
import cn from '@/lib/cn';
import { Button } from '@nextui-org/button';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { name: 'Home', href: '/admin' },
  { name: 'Gate', href: '/admin/gate' },
  { name: 'Registration', href: '/admin/registration' },
  { name: 'Replace', href: '/admin/replace' },
  { name: 'Competitions', href: '/admin/competitions' },
];

// const Logo = () => (
//   <span className='relative w-20 h-20'>
//     <Image fill={true} src={LogoImage} alt='RSL Logo' className='object-contain' />
//   </span>
// );

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { logout } = useAuth();

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
            <Link className={cn(`font-medium`, pathname === link.href && 'text-purple-500', pathname !== link.href && 'text-white')} href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu className='mt-2 from-black to-black/40 bg-gradient-to-b'>
        {LINKS.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link className={cn(`font-medium`, pathname === link.href && 'text-purple-500', pathname !== link.href && 'text-white')} href={link.href}>
              {link.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarItem>
        <Button color='primary' onClick={() => logout()}>
          Logout
        </Button>
      </NavbarItem>
    </Navbar>
  );
}

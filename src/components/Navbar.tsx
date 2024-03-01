import { Navbar as _Navbar, NavbarContent, NavbarItem, Button, Link as UILink } from '@nextui-org/react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  {
    label: 'Home',
    href: '/admin',
  },
];

const Navbar = () => {
  const { logout } = useAuth();
  const path = usePathname();

  return (
    <_Navbar isBordered>
      <NavbarContent className='flex gap-6 lg:gap-8' justify='center'>
        {navItems.map((item, index) => (
          <NavbarItem key={index} isActive={path === item.href}>
            <Link href={item.href}>{item.label}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Button as={UILink} color='primary' variant='flat' onPress={logout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </_Navbar>
  );
};

export default Navbar;

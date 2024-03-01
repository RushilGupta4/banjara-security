'use client';

import { useState, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/modal';
import useRealtimeData from '@/hooks/useRealtimeData';
import { database } from '@/firebase/config';
import { ref, update } from 'firebase/database';
import { EditIcon } from './EditIcon';
import { SearchIcon } from './SearchIcon';

interface UserType {
  uid: string;
  name: string;
  college: string;
  email: string;
  phone: string;
  status: string;
}

const columns = [
  { name: 'UID', id: 'uid' },
  { name: 'Name', id: 'name' },
  { name: 'College', id: 'college' },
  { name: 'Email', id: 'email' },
  { name: 'Phone', id: 'phone' },
  { name: 'Status', id: 'status' },
  { name: 'Edit Status', id: 'editStatus' },
];

export default function AdminPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const usersData = useRealtimeData<UserType[]>('users');
  const [currentUser, setCurrentUser] = useState({ uid: null, name: null, email: null, status: null });
  const [query, setQuery] = useState('');

  const renderCell = useCallback((user: any, columnKey: any) => {
    const cellValue: string = user[columnKey];

    switch (columnKey) {
      case 'name':
        return <p className='text-bold text-sm'>{cellValue}</p>;
      case 'college':
        return <p className='text-sm'>{cellValue}</p>;
      case 'email':
        return <p className='text-sm'>{cellValue}</p>;
      case 'phone':
        return <p className='text-sm'>{cellValue}</p>;
      case 'status':
        return <p className='text-sm text-center mx-auto'>{cellValue}</p>;
      case 'editStatus':
        return (
          <Button size='sm' className='w-full' onClick={() => promptEditStatus(user)}>
            <EditIcon size='small' /> {user.status == 'IN' ? 'Sign Out' : 'Sign In'}
          </Button>
        );
      default:
        return cellValue;
    }
  }, []);

  // Placeholder for the editStatus function
  const promptEditStatus = (user: any) => {
    setCurrentUser(user);
    onOpen();
  };

  const confirmEditStatus = (onClose: () => void) => {
    const id = currentUser.uid; // Assuming each user has a unique ID
    const newPath = `/users/${id}/status`; // Path to the user's status in Firebase
    const newValue = currentUser.status === 'IN' ? 'OUT' : 'IN'; // New status value

    const updates: any = {};
    updates[newPath] = newValue;

    update(ref(database), updates)
      .then(() => {
        // Update successful
        onClose(); // Close modal after updating
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error updating status:', error);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' placement='center' className='py-2'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Warning</ModalHeader>
              <ModalBody>
                <p>Please confirm if you want to make the following change:</p>

                <div className='mx-auto w-11/12'>
                  <li>
                    <b>UID:</b> {currentUser.uid}
                  </li>
                  <li>
                    <b>Name:</b> {currentUser.name}
                  </li>
                  <li>
                    <b>Email:</b> {currentUser.email}
                  </li>
                  <li>
                    <b>Old Status:</b> {currentUser.status}
                  </li>
                  <li>
                    <b>New Status:</b> {currentUser.status == 'IN' ? 'OUT' : 'IN'}
                  </li>
                </div>

                <Button onClick={() => confirmEditStatus(onClose)}>Confirm</Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div>
        <div className='mb-3 w-full flex flex-col items-center justify-center'>
          <Input
            classNames={{
              base: 'max-w-full sm:max-w-[16rem] h-10',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
            placeholder='Type to search...'
            size='sm'
            startContent={<SearchIcon size={18} />}
            type='search'
            onValueChange={setQuery}
            value={query}
          />
        </div>
        <Table aria-label='Admin table with custom cells'>
          <TableHeader columns={columns}>{(column) => <TableColumn key={column.id}>{column.name}</TableColumn>}</TableHeader>
          <TableBody items={usersData.filter((item) => JSON.stringify(Object.values(item)).includes(query)) || []}>
            {(item: UserType) => <TableRow key={item.uid}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/modal';
import { firestore } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { EditIcon } from './EditIcon';
import { SearchIcon } from './SearchIcon';
import { UserType } from '@/types';
import useFirestore from '@/hooks/useFirestore';
import cn from '@/lib/cn';
import { readableAttendingDays } from '@/app/signup/email';

const columns = [
  { name: 'UID', id: 'uid' },
  { name: 'Name', id: 'name' },
  { name: 'College', id: 'college' },
  { name: 'Team', id: 'team' },
  { name: 'Email', id: 'email' },
  { name: 'Phone', id: 'phone' },
  { name: 'Gate', id: 'gateStatus' },
  // { name: 'Edit Status', id: 'editGateStatus' },
  { name: 'Reg Status', id: 'registered' },
  // { name: 'Edit Reg Status', id: 'editRegistered' },
  { name: 'Attending Days', id: 'attendingDays' },
];

export default function AdminPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const usersData = useFirestore<UserType>('users');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentColumn, setCurrentColumn] = useState<any>(null);
  const [query, setQuery] = useState('');

  const renderCell = useCallback((user: any, columnKey: any) => {
    const cellValue: any = user[columnKey];

    switch (columnKey) {
      case 'name':
        return <p className='text-bold text-sm'>{cellValue}</p>;
      case 'college':
      case 'email':
      case 'phone':
        return <p className='text-sm'>{cellValue}</p>;
      case 'team':
        return <p className='text-sm'>{cellValue ? cellValue : 'None'}</p>;
      case 'gateStatus':
        return <p className={cn('text-sm ', cellValue && 'text-green-400', !cellValue && 'text-red-400')}>{cellValue ? 'IN' : 'OUT'}</p>;
      // case 'editGateStatus':
      //   return (
      //     <Button size='sm' className='w-full' onClick={() => promptEdit(user, 'status')}>
      //       <EditIcon size='small' /> {user.gateStatus ? 'Sign Out' : 'Sign In'}
      //     </Button>
      //   );
      case 'registered':
        return <p className={cn('text-sm', cellValue && 'text-green-400', !cellValue && 'text-red-400')}>{cellValue ? 'TRUE' : 'FALSE'}</p>;
      // case 'editRegistered':
      //   return (
      //     <Button size='sm' className='w-full' onClick={() => promptEdit(user, 'registered')}>
      //       <EditIcon size='small' /> {!user.registered ? 'Unregister' : 'Register'}
      //     </Button>
      //   );
      case 'attendingDays':
        return <p className='text-sm'>{readableAttendingDays(cellValue)}</p>;
      default:
        return cellValue;
    }
  }, []);

  const promptEdit = (user: any, column: string) => {
    console.log('Edit status:', user, column);
    setCurrentUser(user);
    setCurrentColumn(column);
    onOpen();
  };

  const confirmEditColumn = (onClose: () => void, column: string) => {
    if (!currentUser) return;
    if (!column) return;

    const id = currentUser.uid;
    const newValue: any = !currentUser[column];

    const userRef = doc(firestore, `users/${id}`);

    updateDoc(userRef, { [column]: newValue })
      .then(() => {
        onClose(); // Close modal after updating
      })
      .catch((error: any) => {
        console.error('Error updating:', error);
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

                  {currentColumn === 'status' ? (
                    <>
                      <li>
                        <b>Old Status:</b> {!currentUser.gateStatus ? 'OUT' : 'IN'}
                      </li>
                      <li>
                        <b>New Status:</b> {currentUser.gateStatus ? 'OUT' : 'IN'}
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <b>Old Verified:</b> {currentUser.registered ? 'True' : 'False'}
                      </li>
                      <li>
                        <b>New Verified:</b> {!currentUser.registered ? 'True' : 'False'}
                      </li>
                    </>
                  )}
                </div>

                <Button onClick={() => confirmEditColumn(onClose, currentColumn)}>Confirm</Button>
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
          <TableBody items={usersData.filter((item) => JSON.stringify(Object.values(item)).toLowerCase().includes(query.toLowerCase())) || []}>
            {(item: UserType) => <TableRow key={item.uid}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

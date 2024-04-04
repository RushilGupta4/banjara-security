'use client';

import { useState, useCallback, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/modal';
import { Switch } from '@nextui-org/switch';
import { Spinner } from '@nextui-org/spinner';
import { firestore } from '@/firebase/config';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { EditIcon } from './EditIcon';
import { SearchIcon } from './SearchIcon';
import { UserType } from '@/types';
import cn from '@/lib/cn';
import { readableAttendingDays } from '@/app/signup/email';
import Link from 'next/link';

const columns = [
  { name: 'UID', id: 'uid' },
  { name: 'Name', id: 'name' },
  { name: 'College', id: 'college' },
  // { name: 'Team', id: 'team' },
  { name: 'Email', id: 'email' },
  { name: 'Phone', id: 'phone' },
  // { name: 'Gate', id: 'gateStatus' },
  // { name: 'Edit Status', id: 'editGateStatus' },
  // { name: 'Reg Status', id: 'registered' },
  // { name: 'Payment', id: 'payment' },
  // { name: 'Edit Reg Status', id: 'editRegistered' },
  // { name: 'Attending Days', id: 'attendingDays' },
];

const masterTableControl = true;

export default function AdminPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userData, setUserData] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentColumn, setCurrentColumn] = useState<any>(null);
  const [searchQuery, setQuery] = useState('');
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersRef);

      const users: UserType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserType;
        users.push(data);
        console.log('User:', data);
      });

      setUserData(users);
    };

    if (!showTable) return;
    if (userData.length > 0) return;

    fetchUsers();
  }, [showTable]);

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
      case 'payment':
        return <p className={cn('text-sm', cellValue && 'text-green-400', !cellValue && 'text-red-400')}>{cellValue ? 'DONE' : 'FALSE'}</p>;
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

      {masterTableControl ? (
        <>
          <div>
            <div className='flex flex-col justify-between items-center mb-8'>
              <Switch className='cursor-pointer' checked={showTable} onChange={() => setShowTable(!showTable)} size='sm' color='primary'>
                Show Table
              </Switch>
            </div>
          </div>
          {showTable && (
            <>
              {userData.length > 0 ? (
                <div>
                  <div className='mb-8 w-full flex flex-col items-center justify-center'>
                    <Input
                      classNames={{
                        base: 'max-w-full sm:max-w-[16rem] h-10',
                        mainWrapper: 'h-full',
                        input: 'text-small',
                        inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
                      }}
                      placeholder='Type to search...'
                      description='Enter 3 or more characters'
                      size='sm'
                      startContent={<SearchIcon size={18} />}
                      type='search'
                      onValueChange={setQuery}
                      value={searchQuery}
                    />
                  </div>
                  <Table aria-label='Admin table with custom cells'>
                    <TableHeader columns={columns}>
                      {(column: { id: any; name: any }) => <TableColumn key={column.id}>{column.name}</TableColumn>}
                    </TableHeader>
                    <TableBody
                      items={userData.filter((item) => JSON.stringify(Object.values(item)).toLowerCase().includes(searchQuery.toLowerCase())) || []}>
                      {(item: UserType) => (
                        <TableRow key={item.uid}>{(columnKey: any) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className='w-full flex flex-col items-center justify-center h-3/4'>
                  <Spinner />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className='mb-3 w-full flex flex-col items-center justify-center h-3/4'>
          <p className='text-4xl'>Please refer to the google sheet!</p>
          <Link
            href='https://docs.google.com/spreadsheets/d/14X1tDZ43XS9BKW8KIJvRz8diX_c_WEpTcL9uRrb5hAw/edit?usp=sharing'
            target='_blank'
            className='text-xl text-blue-500 underline mt-4'>
            View Sheet
          </Link>
        </div>
      )}
    </>
  );
}

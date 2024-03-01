'use client';

import { useState } from 'react';
import { firestore } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StatusUpdatePage = () => {
  const [uid, setUid] = useState('');

  const updateUserStatus = async (newStatus: boolean) => {
    if (!uid) {
      toast.error('Please enter a UID.');
      return;
    }

    const userRef = doc(firestore, `users/${uid}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      toast.error('User does not exist.');
      return;
    }

    const userData = userSnapshot.data();

    // Check if attempting to set the status to the same value
    if (userData.gateStatus === newStatus) {
      toast.error(`User is already marked as ${newStatus ? 'IN' : 'OUT'}.`);
      return;
    }

    try {
      await updateDoc(userRef, { gateStatus: newStatus });
      toast.success(`User status updated to ${newStatus ? 'IN' : 'OUT'}.`);
      setUid(''); // Optionally reset UID input after successful update
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  return (
    <div className='h-[80%] flex flex-col justify-center items-center'>
      <Card className='py-1 w-11/12 md:w-3/5 lg:w-2/5'>
        <CardBody>
          <div className='text-center mb-4'>
            <p className='text-xl font-bold'>Sign In/Out</p>
          </div>
          <Input isClearable fullWidth size='sm' placeholder='User UID' value={uid} onChange={(e) => setUid(e.target.value)} />
          <div className='flex justify-between mt-2 gap-4'>
            <Button className='w-full' color='success' onClick={() => updateUserStatus(true)}>
              Sign In
            </Button>
            <Button className='w-full' color='danger' onClick={() => updateUserStatus(false)}>
              Sign Out
            </Button>
          </div>
        </CardBody>
      </Card>

      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme='dark'
      />
    </div>
  );
};

export default StatusUpdatePage;

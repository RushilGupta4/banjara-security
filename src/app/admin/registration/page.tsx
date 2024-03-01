'use client';

import { useState } from 'react';
import { firestore } from '@/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [uid, setUid] = useState('');

  const updateRegistrationStatus = async (newStatus: boolean) => {
    if (!uid) {
      toast.error('Please enter a UID.');
      return;
    }

    const userRef = doc(firestore, `users/${uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      toast.error('User does not exist.');
      return;
    }

    // Check if attempting to set the registration to the same value
    if (docSnap.data().registered === newStatus) {
      toast.error(`User is already ${newStatus ? 'registered' : 'not registered'}.`);
      return;
    }

    try {
      await updateDoc(userRef, { registered: newStatus });
      toast.success(`User ${newStatus ? 'registered' : 'unregistered'} successfully!`);
      setUid(''); // Optionally reset UID input after successful update
    } catch (error) {
      console.error(`Error updating user's registration status:`, error);
      toast.error('Failed to update registration status. Please try again.');
    }
  };

  return (
    <div className='h-[80%] flex flex-col justify-center items-center'>
      <Card className='py-1 w-11/12 md:w-3/5 lg:w-2/5'>
        <CardBody>
          <div className='text-center mb-4'>
            <p className='text-xl font-bold'>Register/Unregister User</p>
          </div>
          <Input isClearable size='sm' placeholder='User UID' value={uid} onChange={(e) => setUid(e.target.value)} />
          <div className='flex justify-between mt-2 gap-4'>
            <Button onClick={() => updateRegistrationStatus(true)} color='success' className='w-full'>
              Register
            </Button>
            <Button onClick={() => updateRegistrationStatus(false)} color='danger' className='w-full'>
              Unregister
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

export default RegisterPage;

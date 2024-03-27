'use client';

import { useState } from 'react';
import { firestore } from '@/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalHeader, ModalContent, useDisclosure } from '@nextui-org/modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { readableAttendingDays } from '@/app/signup/email';
import { UserType } from '@/types';

const GenericStatusUpdatePage = ({
  dataKey,
  title,
  actionTrue,
  actionFalse,
  confirmationMessageTrue,
  confirmationMessageFalse,
  successMessageTrue,
  successMessageFalse,
  alreadyTrueMessage,
  alreadyFalseMessage,
  prereqKey = null,
}: {
  dataKey: keyof UserType;
  title: string;
  actionTrue: string;
  actionFalse: string;
  confirmationMessageTrue: string;
  confirmationMessageFalse: string;
  successMessageTrue: string;
  successMessageFalse: string;
  alreadyTrueMessage: string;
  alreadyFalseMessage: string;
  prereqKey?: string | null;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

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

    if (prereqKey) {
      if (!docSnap.data()[prereqKey]) {
        toast.error('User has not met the prerequisite.');
        return;
      }
    }

    setStatus(newStatus);
    setCurrentUser(docSnap.data() as UserType);

    onOpen();
  };

  const confirmEditColumn = async (onClose: () => void) => {
    if (!currentUser) {
      toast.error('User data not found.');
      onClose();
      return;
    }

    // Check if attempting to set the registration to the same value
    if (currentUser[dataKey] === status) {
      toast.error(status ? alreadyTrueMessage : alreadyFalseMessage);
      onClose();
      return;
    }

    const userRef = doc(firestore, `users/${uid}`);

    try {
      const data = { [dataKey]: status };
      data.payment = status;

      await updateDoc(userRef, data);
      toast.success(status ? successMessageTrue : successMessageFalse);
      setUid(''); // Optionally reset UID input after successful update
    } catch (error) {
      console.error(`Error updating document status:`, error);
      toast.error('Failed to update status. Please try again.');
    }

    onClose(); // Close modal after updating
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' placement='center' className='py-2 w-11/12'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Warning</ModalHeader>
              <ModalBody>
                <p>{status ? confirmationMessageTrue : confirmationMessageFalse}</p>

                {currentUser && (
                  <>
                    <div className='mx-auto w-11/12'>
                      <li>
                        <b>UID:</b> {currentUser.uid}
                      </li>
                      <li>
                        <b>Name:</b> {currentUser.name}
                      </li>
                      <li>
                        <b>College:</b> {currentUser.college}
                      </li>
                      <li>
                        <b>Email:</b> {currentUser.email}
                      </li>
                      <li>
                        <b>Phone:</b> {currentUser.phone} {currentUser.repeatedNumber ? ' (DUPLICATE)' : ''}
                      </li>
                      <li>
                        <b>Current Payment Status:</b> {currentUser.payment ? 'Paid' : 'Not Paid'}
                      </li>
                      <li>
                        <b>Attending Days:</b> {readableAttendingDays(currentUser.attendingDays)}
                      </li>
                    </div>

                    <span className='text-red-400 font-[500]'>Note: Registering a user means that you have taken money from them </span>

                    <Button className='mt-1' onClick={() => confirmEditColumn(onClose)}>
                      Confirm
                    </Button>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className='h-[80%] flex flex-col justify-center items-center'>
        <Card className='py-1 w-11/12 md:w-3/5 lg:w-2/5'>
          <CardBody>
            <div className='text-center mb-4'>
              <p className='text-xl font-bold'>{title}</p>
            </div>
            <Input isClearable size='sm' placeholder='User UID' value={uid} onChange={(e) => setUid(e.target.value)} />
            <div className='flex justify-between mt-3 gap-4'>
              <Button onClick={() => updateRegistrationStatus(true)} className='text-white w-full' color='success'>
                {actionTrue}
              </Button>
              <Button onClick={() => updateRegistrationStatus(false)} className='text-white w-full' color='danger'>
                {actionFalse}
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
    </>
  );
};

export default function RegistationPage() {
  return (
    <GenericStatusUpdatePage
      dataKey='registered'
      title='Registration'
      actionTrue='Register'
      actionFalse='Unregister'
      confirmationMessageTrue='Are you sure you want to register this user?'
      confirmationMessageFalse='Are you sure you want to unregister this user?'
      successMessageTrue='User has been registered.'
      successMessageFalse='User has been unregistered.'
      alreadyTrueMessage='User is already registered.'
      alreadyFalseMessage='User is already unregistered.'
      prereqKey={'gateStatus'}
    />
  );
}

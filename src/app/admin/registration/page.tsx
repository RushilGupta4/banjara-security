'use client';

import { useState } from 'react';
import { firestore } from '@/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalHeader, ModalContent, useDisclosure } from '@nextui-org/modal';
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';
import { UserType } from '@/types';
import { readableAttendingDays } from '@/app/signup/email';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateAttendingDays } from '@/app/signup/utils';
import { getCurrentDayInt } from '@/lib/dateUtil';

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
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const updateSelectedDays = (days: string[]) => {
    // check if a new day for added to the list
    const newDayAdded = days.length > selectedDays.length;
    if (!newDayAdded) {
      setSelectedDays(days);
    }

    // check the new day added
    const newDay = days.filter((day) => !selectedDays.includes(day))[0];
    const { success, message } = validateAttendingDays(selectedDays, newDay, false);

    if (!success) {
      toast.error(message);
    } else {
      setSelectedDays(days);
    }
  };

  const updateRegistrationStatus = async (newStatus: boolean) => {
    if (!uid) {
      toast.error('Please enter a UID.');
      return;
    }

    try {
      const userRef = doc(firestore, `users/${uid}`);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        toast.error('User does not exist.');
        return;
      }

      if (prereqKey) {
        if (!docSnap.data()[prereqKey]) {
          toast.error('User has not been signed in.');
          return;
        }
      }

      setStatus(newStatus);

      const data = docSnap.data() as UserType;
      setCurrentUser(data);
      setSelectedDays(data.attendingDays);

      onOpen();
    } catch (error) {
      toast.error('Please enter a valid UID.');
      return;
    }
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
      const data = { [dataKey]: status, timestamps: currentUser.timestamps, attendingDays: selectedDays };

      const curDay = getCurrentDayInt();
      const paymentKey = `paymentDay${curDay}` as keyof UserType;

      const entry = {
        [new Date().toISOString()]: (status ? 'Registered' : 'Unregistered') + ` (Day ${curDay})`,
      };
      data.timestamps.push(entry);

      if (status) {
        if (currentUser.attendingDays.includes('3')) {
          data.paymentDay1 = true;
          data.paymentDay2 = true;
        } else {
          if (currentUser.attendingDays.includes(curDay.toString())) {
            //@ts-ignore
            data[paymentKey] = true;
          }
        }
      } else {
        //@ts-ignore
        data[paymentKey] = false;
      }

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
                        <b>Phone:</b> {currentUser.phone}{' '}
                        {currentUser.repeatedNumber && <span className='text-red-400 font-[500]'> (DUPLICATE)</span>}
                      </li>
                      <li>
                        <b>Day 1 Payment Status:</b>{' '}
                        {currentUser.paymentDay1 ? <span className='text-green-400'>Paid</span> : <span className='text-red-400'>Not Paid</span>}
                      </li>
                      <li>
                        <b>Day 2 Payment Status:</b>{' '}
                        {currentUser.paymentDay2 ? <span className='text-green-400'>Paid</span> : <span className='text-red-400'>Not Paid</span>}
                      </li>
                      <li>
                        <b>Attending Days:</b> {readableAttendingDays(currentUser.attendingDays)}
                      </li>
                    </div>

                    {status && (
                      <>
                        {/* Add a modify attending days checkbox group (3 checkboxes) */}
                        <p className='mt-2 font-[500]'>Modify Attending Days</p>
                        <CheckboxGroup
                          orientation='horizontal'
                          // color='secondary'
                          value={selectedDays}
                          onValueChange={updateSelectedDays}>
                          <Checkbox value='1'>Day 1</Checkbox>
                          <Checkbox value='2'>Day 2</Checkbox>
                          <Checkbox value='3'>Both Days</Checkbox>
                        </CheckboxGroup>
                      </>
                    )}

                    <span className='text-red-400 font-[500]'>Note: Registering a user means that you have taken money from them</span>

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

'use client';

import { useState } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalHeader, ModalContent, useDisclosure } from '@nextui-org/modal';
import { firestore } from '@/firebase/config';
import { doc, setDoc, getDoc, writeBatch, collection } from 'firebase/firestore';
import { Replacement, UserType } from '@/types';
import { readableAttendingDays } from '@/app/signup/email';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserCard = ({
  title,
  user,
  userId,
  onReplace,
}: {
  title: string;
  user: UserType | null;
  userId: string;
  onReplace: (value: string) => void;
}) => {
  return (
    <Card className='w-96 shadow-lg'>
      <CardBody>
        <div className='text-center mb-6'>
          <p className='text-xl font-bold'>{title}</p>
        </div>
        <Input isClearable size='sm' placeholder={`${title} UID`} value={userId || ''} onChange={(e) => onReplace(e.target.value)} />
        <div className='flex flex-col px-4 pb-2 pt-3 gap-1'>
          <p>
            <span className='font-semibold'>Name:</span> {user ? user.name : ''}
          </p>
          <p>
            <span className='font-semibold'>College:</span> {user ? user.college : ''}
          </p>
          <p>
            <span className='font-semibold'>Email:</span> {user ? user.email : ''}
          </p>
          <p>
            <span className='font-semibold'>Phone:</span> {user ? user.phone : ''}
          </p>
          <p>
            <span className='font-semibold'>Competitions:</span> {user ? (user.competitions.length > 0 ? user.competitions.join(', ') : 'None') : ''}
          </p>
          <p>
            <span className='font-semibold'>Attending Days:</span> {user ? readableAttendingDays(user.attendingDays) : ''}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

const ReplaceUserPage = () => {
  const [oldUser, setOldUser] = useState<UserType | null>(null);
  const [oldUserId, setOldUserId] = useState<string>('');

  const [newUser, setNewUser] = useState<UserType | null>(null);
  const [newUserId, setNewUserId] = useState<string>('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchUser = async (uid: string) => {
    const userRef = doc(firestore, `users/${uid}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { uid, ...docSnap.data() } as UserType;
    } else {
      return null;
    }
  };

  const onUpdateUser = async (setMethod: (value: UserType | null) => void, setUid: (uid: string) => void, uid: string) => {
    if (uid.length !== 6) {
      setMethod(null);
    } else {
      const user = await fetchUser(uid);
      setMethod(user);
    }
    setUid(uid);
  };

  const replaceOldUser = async () => {
    // Add logic to replace old user with new user
    // You may want to trigger the modal here

    if (oldUserId === newUserId) {
      toast.error('Old and new UIDs should be different');
      return;
    }

    if (!oldUser || !newUser) {
      toast.error('Please enter valid UIDs');
      return;
    }

    if (newUser.competitions.length > 0) {
      toast.error('New user should not be registered for any competitions');
      return;
    }

    onOpen();
  };

  const onReplace = async (onClose: () => void) => {
    // Add logic to replace old user with new user
    // You may want to trigger the modal here

    if (!oldUser || !newUser) {
      toast.error('Please enter valid UIDs');
      return;
    }

    const replacementRef = doc(firestore, `replacements/${oldUserId}`);
    const replacementDoc = await getDoc(replacementRef);
    if (replacementDoc.exists()) {
      toast.error('Old user is already replaced');
      return;
    }

    const batch = writeBatch(firestore);

    // Set new user data with old user's competitions
    const newUserRef = doc(firestore, `users/${newUserId}`);
    const newUserData = { ...newUser, competitions: oldUser.competitions };
    batch.set(newUserRef, newUserData);

    // Log the replacement
    const replacement: Replacement = { oldUserID: oldUserId, newUserID: newUserId };
    batch.set(replacementRef, replacement);

    try {
      await batch.commit(); // Commit the batch
      toast.success('User replaced successfully');
      // Clear state after successful replacement
      setOldUser(null);
      setOldUserId('');
      setNewUser(null);
      setNewUserId('');
      onClose();
    } catch (error) {
      console.error('Error replacing user:', error);
      toast.error('Failed to replace user. Please try again.');
    }
  };

  return (
    <div className='h-full md:h-[80%] flex flex-col justify-center items-center gap-8'>
      <p className='text-4xl font-bold mb-2'>Replace Users</p>
      <div className='flex flex-col lg:flex-row gap-8 mx-auto items-center justify-center'>
        <UserCard title='Old User' user={oldUser} userId={oldUserId} onReplace={(value) => onUpdateUser(setOldUser, setOldUserId, value)} />
        <UserCard title='New User' user={newUser} userId={newUserId} onReplace={(value) => onUpdateUser(setNewUser, setNewUserId, value)} />
      </div>

      <div className='mt-4'>
        <Button onClick={replaceOldUser} className='w-80' color='primary'>
          Replace
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Replace User</ModalHeader>
              <ModalBody>
                {/* Add confirmation message and user details here */}
                <p>Are you sure you want to replace the old user with the new user?</p>
                <Button onClick={onClose} color='warning'>
                  Cancel
                </Button>
                <Button color='primary' onPress={() => onReplace(onClose)}>
                  Confirm
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
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

export default ReplaceUserPage;

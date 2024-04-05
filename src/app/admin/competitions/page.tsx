'use client';

import { useState } from 'react';
import { firestore } from '@/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalHeader, ModalContent, useDisclosure } from '@nextui-org/modal';
import { Checkbox } from '@nextui-org/checkbox'; // Import Checkbox
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserType } from '@/types';

const competitionsData = [
  'Footloose',
  'Dance Off',
  'Battle of the Bands',
  'Concordia',
  'Jukebox',
  'Nautanki',
  'Mukhauta',
  'Rahageer',
  'Symphony of Suspicion',
  'Ashoka Parliamentary Debate',
  'Trashionista',
  'Aaina',
  'In-quiz-itive',
  'Marketing 101',
  'Space Turtle',
  'FIFA',
  'Valorant',
  'Starstruck',
  'Samadhan',
  'Barrier Barage',
  'Food Fiesta',
];

const CompetitionUpdatePage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uid, setUid] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
  const [team, setTeam] = useState('');

  const userIDUpdate = async (newUserID: string) => {
    setUid(newUserID);

    if (!newUserID) {
      setCurrentUser(null);
      return;
    }

    const userRef = doc(firestore, `users/${newUserID}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      setCurrentUser(docSnap.data() as UserType);
      setSelectedCompetitions(docSnap.data().competitions || []);
      setTeam(docSnap.data().team || '');
    } else {
      setCurrentUser(null);
    }
  };

  const handleCompetitionChange = (competitionName: string) => {
    if (selectedCompetitions.includes(competitionName)) {
      setSelectedCompetitions(selectedCompetitions.filter((comp) => comp !== competitionName));
    } else {
      setSelectedCompetitions([...selectedCompetitions, competitionName]);
    }
  };

  const tryUpdateCompetitions = () => {
    if (uid === '') {
      toast.error('Please enter a valid UID.');
      return;
    }

    if (!currentUser) {
      toast.error('User not found.');
      return;
    }

    onOpen();
  };

  const confirmUpdate = async (onClose: () => void) => {
    try {
      const userRef = doc(firestore, `users/${uid}`);
      await updateDoc(userRef, {
        competitions: selectedCompetitions,
        team,
      });
      toast.success('Competitions updated successfully!');
      userIDUpdate(''); // Reset UID
      setSelectedCompetitions([]); // Reset competitions
      setTeam('');
      onClose();
    } catch (error) {
      console.error(`Error updating competitions:`, error);
      toast.error('Failed to update competitions. Please try again.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' placement='center' className='py-2 w-11/12'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Changes</ModalHeader>
              <ModalBody>
                <p>Please confirm the competition changes for this user:</p>

                <div className='mx-auto w-full'>
                  {currentUser && (
                    <ul>
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
                        <b>Current Team:</b> {currentUser?.team || 'None'}
                      </li>
                      <li>
                        <b>New Team:</b> {team || 'None'}
                      </li>
                      <br />
                      <li>
                        <b>Competitions:</b> {selectedCompetitions.length > 0 ? selectedCompetitions.join(', ') : 'None'}
                      </li>
                    </ul>
                  )}
                </div>
              </ModalBody>

              <Button className='mx-2' onClick={() => confirmUpdate(onClose)}>
                Confirm
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className='h-[80%] flex flex-col justify-center items-center'>
        <Card className='py-1 w-11/12 md:w-3/5 lg:w-2/5'>
          <CardBody>
            <div className='text-center mb-4'>
              <p className='text-xl font-bold'>Update User Competitions</p>
            </div>
            <div className='flex flex-col gap-2'>
              <Input isClearable size='sm' placeholder='User UID' value={uid} onValueChange={(value: string) => userIDUpdate(value)} />

              <Input
                isClearable
                size='sm'
                placeholder='Team'
                value={team}
                onValueChange={setTeam}
                disabled={currentUser == null} // Disable if no user exists
              />
            </div>

            <div className='mt-3 w-11/12 mx-auto'>
              <div className='flex flex-col gap-2'>
                {competitionsData.map((competition: string, index: number) => (
                  <Checkbox
                    key={index}
                    value={competition}
                    isSelected={selectedCompetitions.includes(competition)}
                    onChange={() => handleCompetitionChange(competition)}
                    isDisabled={currentUser == null}>
                    {competition}
                  </Checkbox>
                ))}
              </div>
            </div>

            <Button onClick={tryUpdateCompetitions} className='text-white w-full mt-4' color='primary'>
              Update Competitions
            </Button>
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

export default CompetitionUpdatePage;

'use client';

import { use, useState } from 'react';
import { getEmailHTML, getEmailText } from './email';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { UserType } from '@/types';
import { firestore } from '@/firebase/config';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const registerationOptions = [
  { label: 'Day 1', value: '1' },
  { label: 'Day 2', value: '2' },
  { label: 'Both Days', value: '3' },
];

const SignupForm = () => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendingDay, setAttendingDay] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    const isEmailValid = emailRegex.test(email);
    const isPhoneValid = phone.length >= 10;
    const isAttendingDaysValid = attendingDay != null && attendingDay.length > 0;
    return isEmailValid && isPhoneValid && isAttendingDaysValid;
  };

  const checkIfUserExists = async () => {
    const usersRef = collection(firestore, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const phoneQuery = query(usersRef, where('phone', '==', phone));

    const emailQuerySnapshot = await getDocs(emailQuery);
    const phoneQuerySnapshot = await getDocs(phoneQuery);

    if (!emailQuerySnapshot.empty) {
      const user = emailQuerySnapshot.docs[0].data() as UserType;
      return { status: true, existingUser: user, error: 'Email already registered.' };
    }

    if (!phoneQuerySnapshot.empty) {
      const user = phoneQuerySnapshot.docs[0].data() as UserType;
      return { status: true, existingUser: user, error: 'Phone number already registered.' };
    }

    return { status: false, existingUser: null, error: null };
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateInput()) {
      toast.error('Please fill all the fields!');
      setLoading(false);
      return;
    }

    let emailOptions = {};

    // Generate a random 6-digit UID
    const uid = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: UserType = {
      uid,
      name,
      college,
      email,
      phone,
      gateStatus: false,
      registered: false,
      competitions: [],
      attendingDays: [attendingDay],
    };

    const { status, existingUser, error } = await checkIfUserExists();
    if (status) {
      if (!existingUser) {
        toast.error(error);
        setLoading(false);
        return;
      }

      if (existingUser.attendingDays.includes('3')) {
        toast.error('User already registered for both days.');
        setLoading(false);
        return;
      }

      if (existingUser.attendingDays.includes(attendingDay)) {
        toast.error('User already registered for the selected day.');
        setLoading(false);
        return;
      }

      if (attendingDay === '1' && existingUser.attendingDays.includes('2')) {
        toast.error('User already registered for Day 2.');
        setLoading(false);
        return;
      }

      if (attendingDay === '3' && existingUser.attendingDays.length > 0) {
        toast.error('User already registered for a day.');
        setLoading(false);
        return;
      }

      existingUser.attendingDays.push(attendingDay);

      const existingUserRef = doc(firestore, `users/${existingUser.uid}`);
      await setDoc(existingUserRef, existingUser);
      emailOptions = {
        to: existingUser.email,
        subject: 'Banjara Day Registration Email',
        html: getEmailHTML(existingUser),
        text: getEmailText(existingUser),
      };
    } else {
      // Use the random 6-digit UID as the document ID
      const newUserRef = doc(firestore, `users/${uid}`);

      emailOptions = {
        to: newUser.email,
        subject: 'Banjara Verification Email',
        html: getEmailHTML(newUser),
        text: getEmailText(newUser),
      };

      await setDoc(newUserRef, newUser);
    }

    try {
      const resp = await fetch('/email', {
        method: 'POST',
        body: JSON.stringify(emailOptions),
      });

      if (resp.status != 200) throw new Error('Email sending failed');
      toast.success('Registration successful!');

      setName('');
      setCollege('');
      setEmail('');
      setPhone('');
      setAttendingDay('');

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Card className='py-2 px-1 md:p-4 w-[95%] md:w-5/6 lg:w-2/3 m-auto' shadow='lg'>
        <p className='text-center mx-auto text-3xl md:text-4xl font-bold py-4'>Banjara On-Spot Registration</p>
        <CardBody className='gap-4'>
          {/* Input fields for UID, name, college, email, phone */}
          <Input size='sm' label='Name' value={name} onValueChange={setName} required />
          <Input size='sm' label='College' value={college} onValueChange={setCollege} required />
          <Input size='sm' label='Email' value={email} onValueChange={setEmail} required />
          <Input size='sm' label='Phone' value={phone} onValueChange={setPhone} required />

          <Select
            size='sm'
            items={registerationOptions}
            label='Registration Type'
            selectedKeys={attendingDay}
            onSelectionChange={(value: any) => setAttendingDay(value.currentKey)}>
            {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
          </Select>
          {/* Submit button */}
          <Button onClick={handleSubmit} color='primary' isLoading={loading}>
            Sign Up
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
  );
};

export default SignupForm;

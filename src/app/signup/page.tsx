'use client';

import { useState } from 'react';
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
import { validateAttendingDays } from './utils';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const registerationOptions = [
  { label: 'Day 1', value: '1' },
  { label: 'Day 2', value: '2' },
  { label: 'Both Days', value: '3' },
];

const generateUUID = async (): Promise<string> => {
  const uid = Math.floor(100000 + Math.random() * 900000).toString();
  // check if uid exists in firestore
  const usersRef = collection(firestore, 'users');
  const queryRef = query(usersRef, where('uid', '==', uid));
  const querySnapshot = await getDocs(queryRef);

  if (querySnapshot.empty) {
    return uid;
  }
  return generateUUID();
};

const SignupForm = () => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendingDay, setAttendingDay] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = (finalPhone: string) => {
    const isEmailValid = emailRegex.test(email);
    const isPhoneValid = finalPhone.length >= 10;
    const isAttendingDaysValid = attendingDay != null && attendingDay.length > 0;
    return isEmailValid && isPhoneValid && isAttendingDaysValid;
  };

  const checkIfUserExists = async (email: string, phone: string) => {
    const usersRef = collection(firestore, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const phoneQuery = query(usersRef, where('phone', '==', phone));

    const emailQuerySnapshot = await getDocs(emailQuery);
    const phoneQuerySnapshot = await getDocs(phoneQuery);

    const repeatedNumber = !phoneQuerySnapshot.empty;

    if (!emailQuerySnapshot.empty) {
      const user = emailQuerySnapshot.docs[0].data() as UserType;
      return { status: true, existingUser: user, error: 'Email already registered.', repeatedNumber };
    }

    return { status: false, existingUser: null, error: null, repeatedNumber };
  };

  const handleSubmit = async () => {
    setLoading(true);

    let finalPhone = phone.length > 10 && phone.startsWith('91') ? phone.replace('91', '') : phone;
    finalPhone = finalPhone.startsWith('+91') ? finalPhone.replace('+91', '') : finalPhone;
    finalPhone = finalPhone.startsWith('0') ? finalPhone.substring(1) : finalPhone;
    if (finalPhone.length !== 10) {
      toast.error('Invalid phone number!');
      setLoading(false);
      return;
    }

    if (!validateInput(finalPhone)) {
      toast.error('Please fill all the fields!');
      setLoading(false);
      return;
    }

    let emailOptions = {};

    const { status, existingUser, error, repeatedNumber } = await checkIfUserExists(email, finalPhone);

    // Generate a random 6-digit UID
    const uid = await generateUUID();
    const newUser: UserType = {
      uid,
      name,
      college,
      email,
      phone: finalPhone,
      gateStatus: false,
      registered: false,
      competitions: [],
      attendingDays: [attendingDay],
      paymentDay1: false,
      paymentDay2: false,
      timestamps: [],
      repeatedNumber,
    };

    if (status) {
      if (!existingUser) {
        toast.error(error);
        setLoading(false);
        return;
      }

      const { success, message } = validateAttendingDays(existingUser.attendingDays, attendingDay);
      if (!success) {
        toast.error(message);
        setLoading(false);
        return;
      }

      existingUser.attendingDays.push(attendingDay);

      const existingUserRef = doc(firestore, `users/${existingUser.uid}`);
      await setDoc(existingUserRef, existingUser);
      emailOptions = {
        to: existingUser.email,
        subject: 'Banjaara Day Registration Email',
        html: getEmailHTML(existingUser),
        text: getEmailText(existingUser),
      };
    } else {
      // Use the random 6-digit UID as the document ID
      const newUserRef = doc(firestore, `users/${uid}`);

      emailOptions = {
        to: newUser.email,
        subject: 'Banjaara Verification Email',
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
        <p className='text-center mx-auto text-3xl md:text-4xl font-bold py-4'>Banjaara On-Spot Registration</p>
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

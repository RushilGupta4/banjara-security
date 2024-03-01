'use client';

import { useState } from 'react';
import { getEmailHTML, getEmailText } from './email';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { UserType } from '@/types';
import { firestore } from '@/firebase/config';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupForm = () => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    const isEmailValid = emailRegex.test(email);
    const isPhoneValid = phone.length >= 10;
    setIsEmailInvalid(!isEmailValid);
    setIsPhoneInvalid(!isPhoneValid);
    return isEmailValid && isPhoneValid;
  };

  const checkIfUserExists = async () => {
    const usersRef = collection(firestore, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const phoneQuery = query(usersRef, where('phone', '==', phone));

    const emailQuerySnapshot = await getDocs(emailQuery);
    const phoneQuerySnapshot = await getDocs(phoneQuery);

    if (!emailQuerySnapshot.empty) {
      toast.error('Email already registered.');
      return true;
    }

    if (!phoneQuerySnapshot.empty) {
      toast.error('Phone number already registered.');
      return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateInput()) {
      toast.error('Please correct the errors before submitting.');
      setLoading(false);
      return;
    }

    const userExists = await checkIfUserExists();
    if (userExists) {
      setLoading(false);
      return;
    }

    // Generate a random 6-digit UID
    const uid = Math.floor(100000 + Math.random() * 900000).toString();

    const user: UserType = {
      uid,
      name,
      college,
      email,
      phone,
      gateStatus: false,
      registered: false,
    };

    // Use the random 6-digit UID as the document ID
    const newUserRef = doc(firestore, `users/${uid}`);

    const emailOptions = {
      to: user.email,
      subject: 'Banjara Verification Email',
      html: getEmailHTML(user),
      text: getEmailText(user),
    };

    try {
      await setDoc(newUserRef, user);
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
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div>
      <p className='text-center mx-auto text-3xl font-bold my-2'>Banjara On-Spot Registration</p>
      <Card className='w-11/12 md:w-2/2 lg:w-1/2 mx-auto'>
        <CardBody className='gap-4 p-4'>
          {/* Input fields for UID, name, college, email, phone */}
          <Input size='sm' label='Name' value={name} onValueChange={setName} required />
          <Input size='sm' label='College' value={college} onValueChange={setCollege} required />
          <Input
            size='sm'
            label='Email'
            value={email}
            onValueChange={setEmail}
            isInvalid={isEmailInvalid}
            errorMessage={isEmailInvalid ? 'Invalid email format' : ''}
            required
          />
          <Input
            size='sm'
            label='Phone'
            value={phone}
            onValueChange={setPhone}
            isInvalid={isPhoneInvalid}
            errorMessage={isPhoneInvalid ? 'Phone number must be at least 10 characters' : ''}
            required
          />

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

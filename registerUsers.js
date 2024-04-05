const { doc, setDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const userData = require('./users2.json');

const firebaseConfig = {
  apiKey: 'AIzaSyBVkx_3Zu26p7kThmr2vxSKILb-t2splT0',
  authDomain: 'ashoka-banjara-security.firebaseapp.com',
  databaseURL: 'https://ashoka-banjara-security-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ashoka-banjara-security',
  storageBucket: 'ashoka-banjara-security.appspot.com',
  messagingSenderId: '1062559169341',
  appId: '1:1062559169341:web:71ed8d960e1fed47ac6354',
  measurementId: 'G-RLSM28NQC8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const readableAttendingDays = (attendingDays) => {
  if (attendingDays.includes('3')) {
    return 'Both days';
  }
  if (attendingDays.includes('1') && attendingDays.includes('2')) {
    return 'Day 1 and Day 2';
  }
  if (attendingDays.includes('1')) {
    return 'Day 1';
  }
  if (attendingDays.includes('2')) {
    return 'Day 2';
  }
};

const getEmailHTML = (userData) => {
  return `
        <h1>Hi ${userData.name},</h1>
        <p>Thanks for registering for Ashoka University's cultural fest, Banjaara.</p>
        <p>Here are your registration details:</p>
        <ul>
            <li>UID: ${userData.uid}</li>
            <li>Name: ${userData.name}</li>
            <li>Email: ${userData.email}</li>
            <li>Phone: ${userData.phone}</li>
            <li>College: ${userData.college}</li>
            <li>Attending Days: ${readableAttendingDays(userData.attendingDays)}</li>
        </ul>
        <p>We look forward to seeing you there!</p>
    `;
};

const getEmailText = (userData) => {
  return `
            Hi ${userData.name},
            Thanks for registering for Ashoka University's cultural fest, Banjaara.
            Here are your registration details:
            UID: ${userData.uid}
            Name: ${userData.name}
            Email: ${userData.email}
            Phone: ${userData.phone}
            College: ${userData.college}
            Attending Days: ${readableAttendingDays(userData.attendingDays)}
            We look forward to seeing you there!
        `;
};

const regUser = async (user) => {
  user.attendingDays = user.attendingDays.map((day) => day.toString());
  const newUserRef = doc(firestore, `users/${user.uid}`);

  const emailOptions = {
    to: user.email,
    subject: 'Banjaara Verification Email',
    html: getEmailHTML(user),
    text: getEmailText(user),
  };

  await setDoc(newUserRef, user);
  // return;

  try {
    const resp = await fetch('http://localhost:3000/email', {
      method: 'POST',
      body: JSON.stringify(emailOptions),
    });

    if (resp.status != 200) throw new Error('Email sending failed');
  } catch (error) {
    console.log(user.email, error);
  }
};

let i = 1;
userData.forEach(async (user) => {
  await regUser(user);
  console.log(i, 'Registered', user.email);
  i++;

  await new Promise((resolve) => setTimeout(resolve, 1000));
});

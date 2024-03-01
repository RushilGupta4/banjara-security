'use client';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

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
// const database = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore, auth };

// export { auth, firestore, database };

'use client';

import { firestore } from '@/firebase/config';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Adjusted useRealtimeData hook for Firestore
function useFirestore<T>(collectionPath: string) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, collectionPath),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ ...doc.data() } as T));
        setData(data);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    return () => unsubscribe();
  }, [collectionPath]);

  return data;
}

export default useFirestore;

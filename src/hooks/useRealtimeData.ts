'use client';

import { useEffect, useState } from 'react';
import { database } from '@/firebase/config';
import { off, onValue, ref } from 'firebase/database';

function useRealtimeData<T>(path: string) {
  const [data, setData] = useState<T | any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(database, path);

        onValue(dbRef, (snapshot: any) => {
          const data = Object.entries(snapshot.val()).map(([id, item]: any) => ({ uid: id, ...item }));
          setData(data);
        });

        return () => off(dbRef);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [path]);

  return data;
}

export default useRealtimeData;

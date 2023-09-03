import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Loader from '@/components/Loader';
import Event from './Event';

const EventContainer = () => {
  console.log('EventContainer');
  const id = useParams().id || 'default';
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const getId = async (id: string) => {
    // Simulating a fetch
    const result = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true); // or false
      }, 2000);
    });
    return result;
  };

  useEffect(() => {
    getId(id)
      .then((valid) => setIsValid(valid))
      .finally(() => console.log('Done'));
  }, [id]);

  if (isValid === null) {
    return <Loader />;
  }

  return isValid ? <Event id={id} /> : <Navigate to='/error' />;
};

export default EventContainer;

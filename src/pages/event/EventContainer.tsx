import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { checkEventExists } from '@/utils/firestore-operations';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader';
import Event from './Event';

const EventContainer = () => {
  const id = useParams().id || 'default';
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkEventExists(id)
      .then(() => setIsValid(true))
      .catch((err: Error) => {
        console.error('Error: ', err.message);
        navigate('/error', { state: { errorCode: 401 } });
      });
  }, [id]);

  if (isValid === null) {
    return <Loader />;
  }

  return isValid ? <Event id={id} /> : <Navigate to='/error' />;
};

export default EventContainer;

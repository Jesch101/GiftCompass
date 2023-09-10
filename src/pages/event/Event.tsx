import React, { useState, useEffect, Suspense } from 'react';
import { getEvent } from '@/utils/firestore-operations';
import Loader from '@/components/Loader';

interface EventProps {
  id: string;
}

const Event: React.FC<EventProps> = ({ id }) => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      // TODO UPDATE THIS
      const data = await getEvent(id);
      setEventData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container flex min-h-[calc(100vh-68px-80px)] flex-col items-center justify-center'>
      {eventData ? (
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-3xl font-bold'>{eventData.name}</h1>
          <p className='text-xl'>{eventData.description}</p>
        </div>
      ) : (
        <p>Event not found</p>
      )}
    </div>
  );
};

export default Event;

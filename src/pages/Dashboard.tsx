import React from 'react';
import { useAuth } from '@/context/AuthContext';
import CollapsibleCard from '@/components/CollapsibleCard';
import EventCard from '@/components/EventCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  return (
    <div className='container flex w-full flex-col items-center gap-2'>
      <h1 className='text-2xl font-bold'>{currentUser.displayName}'s Dashboard</h1>
      <div className='grid w-full grid-cols-2 gap-4'>
        <CollapsibleCard
          open
          title='Your Events'
          className='col-span-2 w-full bg-base-200 text-base-content lg:col-span-1'>
          Test
        </CollapsibleCard>
        <CollapsibleCard
          open
          title='Your Events'
          className='col-span-2 w-full max-w-6xl bg-base-200 text-base-content lg:col-span-1'>
          Test
        </CollapsibleCard>
      </div>
    </div>
  );
};

export default Dashboard;

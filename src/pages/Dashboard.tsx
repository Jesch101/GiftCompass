import React from 'react';
import { useAuth } from '@/context/AuthContext';
import CollapsibleCard from '@/components/CollapsibleCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  return (
    <div className='container flex w-full flex-col items-center gap-2'>
      <h1 className='text-2xl font-bold'>{currentUser.displayName}'s Dashboard</h1>
      <div className='flex w-full justify-center'>
        <CollapsibleCard
          open
          title='Your Events'
          className='w-full max-w-6xl bg-base-300 text-base-content'>
          <div className='grid grid-cols-2 '></div>
        </CollapsibleCard>
      </div>
    </div>
  );
};

export default Dashboard;

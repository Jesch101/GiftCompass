import React from 'react';
import Gift from '@/models/Gift';
import GiftCard from '@/components/event/GiftCard';
import { useAuth } from '@/context/AuthContext';

interface ClaimedGiftsProps {
  gifts: Gift[];
  refetchData: () => Promise<void>;
}
const ClaimedGifts: React.FC<ClaimedGiftsProps> = ({ gifts, refetchData }) => {
  const { currentUser } = useAuth();
  gifts = gifts.filter((gift) => gift.claimedById === currentUser.uid);
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {gifts.length > 0 ? (
        <>
          {gifts.map((gift) => (
            <div
              className='col-auto'
              key={gift.id}>
              <GiftCard
                gift={gift}
                refetchData={refetchData}
              />
            </div>
          ))}
        </>
      ) : (
        <p className='text-lg'>No gifts here yet!</p>
      )}
    </div>
  );
};

export default ClaimedGifts;

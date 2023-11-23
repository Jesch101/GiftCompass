import React from 'react';
import Gift from '@/models/Gift';
import GiftCard from '@/components/event/GiftCard';
import { useAuth } from '@/context/AuthContext';

interface UnclaimedGiftsProps {
  gifts: Gift[];
  refetchData: () => Promise<void>;
}

const UnclaimedGifts: React.FC<UnclaimedGiftsProps> = ({ gifts, refetchData }) => {
  const { currentUser } = useAuth();

  const filteredGifts = gifts.filter((gift) => {
    return gift.claimedById == null && gift.requestedById !== currentUser.uid;
  });

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {filteredGifts.length > 0 ? (
        <>
          {filteredGifts.map((gift) => (
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

export default UnclaimedGifts;

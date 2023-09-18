import React, { useState, useEffect } from 'react';
import Gift from '@/models/Gift';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { deleteGift } from '@/utils/firestore-operations';
import ConfirmGiftDeleteModal from './ConfirmGiftDeleteModal';

interface GiftCardProps {
  gift: Gift;
  refetchData: () => Promise<void>;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, refetchData }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleGiftDelete = async () => {
    setShowConfirmDeleteModal(true);
    if (confirmDelete) {
      setDeleteLoading(true);
      try {
        await deleteGift(gift);
      } catch (error: any) {
        console.error('Error deleting gift:', error.message);
      } finally {
        setShowConfirmDeleteModal(false);
        refetchData();
        setConfirmDelete(false);
        setDeleteLoading(false);
      }
    }
  };

  useEffect(() => {
    if (confirmDelete) {
      handleGiftDelete();
    }
  }, [confirmDelete]);

  return (
    <>
      <ConfirmGiftDeleteModal
        visible={showConfirmDeleteModal}
        setVisible={setShowConfirmDeleteModal}
        setConfirmDelete={setConfirmDelete}
        deleteLoading={deleteLoading}
      />
      <div
        className={cn('card card-compact w-full max-w-sm shadow-xl', {
          'bg-neutral text-neutral-content': theme === 'night',
          'bg-base-100 text-base-content': theme === 'corporate',
        })}>
        <div className='card-body'>
          <div>
            <div className='flex items-center justify-center font-bold'>
              <h2 className='text-xl'>{gift.name}</h2>
            </div>
            <div className='divider m-0'></div>
            <p className='text-lg'>
              <span className='font-semibold'>Details:</span> {gift?.details}
            </p>
            <p className='text-lg'>
              <span className='font-semibold'>Category:</span> {gift?.giftCategory}
            </p>
            <p className='text-lg'>
              <span className='font-semibold'>Price:</span> {gift.price ? gift.price : 'N/A'}
            </p>
            <div className='divider m-0'></div>
            {gift?.requestedByName && (
              <p className='text-lg'>
                <span className='font-semibold'>Requested By:</span>{' '}
                {gift?.anonymous ? 'Anonymous' : gift?.requestedByName}
              </p>
            )}
            <div className='divider m-0'></div>
          </div>
          <div className='card-actions justify-end'>
            {currentUser.uid === gift.requestedById ? (
              <>
                <button
                  className='btn btn-error btn-xs normal-case'
                  onClick={handleGiftDelete}>
                  Delete Gift
                </button>
                <div className='hover:cursor-not-allowed'>
                  <button className='btn btn-primary btn-xs normal-case'>Edit Gift</button>
                </div>
              </>
            ) : (
              <button className='btn btn-primary btn-sm normal-case'>Claim Gift</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftCard;

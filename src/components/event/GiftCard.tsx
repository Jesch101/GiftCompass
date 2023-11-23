import React, { useState, useEffect } from 'react';
import Gift from '@/models/Gift';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { deleteGift, claimGift, unclaimGift } from '@/utils/firestore-operations';
import { MdEdit, MdDelete } from 'react-icons/md';
import ConfirmGiftDeleteModal from './ConfirmGiftDeleteModal';
import ConfirmGiftClaimModal from './ConfirmGiftClaimModal';
import StatusTag from '../StatusTag';
import Accordion from '../Accordion';

interface GiftCardProps {
  gift: Gift;
  refetchData: () => Promise<void>;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, refetchData }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [showConfirmClaimModal, setShowConfirmClaimModal] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [confirmClaim, setConfirmClaim] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [unclaimLoading, setUnclaimLoading] = useState<boolean>(false);

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

  const handleGiftClaim = async () => {
    setShowConfirmClaimModal(true);
    if (confirmClaim) {
      setConfirmLoading(true);
      try {
        await claimGift(gift, currentUser.uid);
      } catch (error: any) {
        console.error('Error claiming gift:', error.message);
      } finally {
        setShowConfirmClaimModal(false);
        refetchData();
        setConfirmClaim(false);
        setConfirmLoading(false);
      }
    }
  };

  const handleGiftUnclaim = async () => {
    setUnclaimLoading(true);
    try {
      await unclaimGift(gift, currentUser.uid);
    } catch (error: any) {
      console.error('Error unclaiming gift:', error.message);
    } finally {
      refetchData();
      setUnclaimLoading(false);
    }
  };

  useEffect(() => {
    if (confirmDelete) {
      handleGiftDelete();
    }
  }, [confirmDelete]);

  useEffect(() => {
    if (confirmClaim) {
      handleGiftClaim();
    }
  }, [confirmClaim]);

  return (
    <>
      <ConfirmGiftDeleteModal
        visible={showConfirmDeleteModal}
        setVisible={setShowConfirmDeleteModal}
        setConfirmDelete={setConfirmDelete}
        deleteLoading={deleteLoading}
      />
      <ConfirmGiftClaimModal
        visible={showConfirmClaimModal}
        setVisible={setShowConfirmClaimModal}
        setConfirmClaim={setConfirmClaim}
        confirmLoading={confirmLoading}
      />
      <div
        className={cn('card card-compact w-full max-w-sm drop-shadow-xl', {
          'bg-neutral text-neutral-content': theme === 'night',
          'bg-base-100 text-base-content': theme === 'corporate',
        })}>
        <div className='card-body'>
          {/* Gift Title and Status Tag */}
          <div className='mx-1 flex items-center justify-between'>
            <h1 className='break-all pr-2 text-2xl font-bold'>{gift.name}</h1>
            {gift?.claimedById ? (
              <StatusTag status='claimed' />
            ) : gift?.requestedById === currentUser.uid ? (
              <StatusTag status='requested' />
            ) : (
              <StatusTag status='unclaimed' />
            )}
          </div>
          <div className='divider m-0'></div>
          {/* Details accordion */}
          <Accordion
            items={[
              {
                title: 'Details',
                content: (
                  <div className='p-4'>
                    <p className='text-md'>
                      <span className='font-semibold'>Description:</span>{' '}
                      {gift.details ? gift.details : 'N/A'}
                    </p>
                    <p className='text-md'>
                      <span className='font-semibold'>Category:</span>{' '}
                      {gift.giftCategory ? gift.giftCategory : 'N/A'}
                    </p>
                    <p className='text-md'>
                      <span className='font-semibold'>Price:</span>{' '}
                      {gift.price ? gift.price : 'N/A'}
                    </p>
                  </div>
                ),
              },
            ]}
          />

          {gift?.requestedByName && (
            <p className='mx-1 text-lg'>
              <span className='font-semibold'>Requested By:</span>{' '}
              {gift.anonymous ? 'Anonymous' : gift?.requestedByName}
            </p>
          )}
          <div className='card-actions mt-1 justify-end'>
            {/* Conditional rendering based on gift status and loading state */}
            {currentUser.uid === gift.requestedById ? (
              <>
                <div
                  className='tooltip'
                  data-tip='Delete'>
                  <button
                    className='btn btn-circle btn-outline btn-error'
                    onClick={handleGiftDelete}>
                    <MdDelete size={20} />
                  </button>
                </div>
                {/* <div
                  className='tooltip hover:cursor-not-allowed'
                  data-tip='Edit'>
                  <button
                    className='btn btn-circle btn-outline btn-info'
                    onClick={handleEditGift}>
                    <MdEdit size={20} />
                  </button>
                </div> */}
              </>
            ) : currentUser.uid !== gift.requestedById && gift?.claimedById == null ? (
              <button
                onClick={handleGiftClaim}
                className='btn btn-info btn-sm w-full normal-case'>
                Claim Gift
              </button>
            ) : currentUser.uid === gift.claimedById ? (
              <>
                {unclaimLoading ? (
                  <span className='loading loading-spinner loading-sm'></span>
                ) : (
                  <button
                    onClick={handleGiftUnclaim}
                    className='btn btn-primary btn-sm w-full'>
                    Unclaim Gift
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftCard;

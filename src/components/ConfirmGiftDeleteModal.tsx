import React from 'react';
import { Modal } from '@mui/material';

interface ConfirmGiftDeleteModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
  deleteLoading: boolean;
}

const ConfirmGiftDeleteModal: React.FC<ConfirmGiftDeleteModalProps> = ({
  visible,
  setVisible,
  setConfirmDelete,
  deleteLoading,
}) => {
  console.log('here');
  return (
    <Modal
      open={visible}
      onClose={() => setVisible(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <div className='absolute left-[50%] top-[50%] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg border bg-base-100 px-12 py-4 shadow-lg'>
        <h2
          id='modal-modal-title'
          className='mb-4 w-full max-w-sm text-lg font-semibold'>
          Are you sure you want to delete this gift? This action cannot be undone.
        </h2>
        <div className='flex flex-row justify-end gap-4'>
          {deleteLoading ? (
            <span className='loading loading-spinner loading-lg'></span>
          ) : (
            <>
              <button
                className='btn btn-error btn-sm normal-case'
                onClick={() => setConfirmDelete(true)}>
                Delete Gift
              </button>
              <button
                className='btn btn-primary btn-sm normal-case'
                onClick={() => setVisible(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmGiftDeleteModal;

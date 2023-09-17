import React, { useState } from 'react';
import Gift from '@/models/Gift';
import { Modal } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { addGiftToEvent } from '@/utils/firestore-operations';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface AddGiftModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  eventData: any;
  fetchEventGifts: () => Promise<void>;
}

const AddGiftModal: React.FC<AddGiftModalProps> = ({
  visible,
  setVisible,
  eventData,
  fetchEventGifts,
}) => {
  if (!visible) return null;

  const { currentUser } = useAuth();
  const [gift, setGift] = useState<Gift>({
    id: uuidv4(),
    eventId: eventData.id,
    name: '',
    price: '',
    link: '',
    requestedByName: currentUser.displayName,
    requestedById: currentUser.uid,
    reservedAt: new Date(),
    anonymous: false,
    giftCategory: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGift({
      ...gift,
      [name]: value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setGift({
      ...gift,
      giftCategory: value,
    });
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addGiftToEvent(eventData.id, gift)
      .then(() => {
        fetchEventGifts();
      })
      .catch((error) => {
        console.error('Error adding gift: ', error);
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };

  return (
    <Modal
      open={visible}
      onClose={() => setVisible(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <div
        className={cn(
          'absolute left-[50%] top-[50%] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-scroll overflow-y-auto rounded-lg border bg-neutral px-12 py-4 text-neutral-content shadow-lg',
          {
            'bg-base-100 text-base-content': theme === 'corporate',
          }
        )}
        style={{ maxHeight: '90vh' }}>
        <div className='prose'>
          <h2
            id='modal-modal-title'
            className='mb-4 w-full max-w-sm'>
            Add a New Gift
          </h2>
        </div>
        <form
          onSubmit={handleGiftSubmit}
          className='flex flex-col space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block font-medium text-base-content'>
              Gift Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              required
              autoComplete='off'
              className='mt-1 w-full max-w-sm rounded-md border p-2'
              value={gift.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor='giftCategory'
              className='block font-medium text-base-content'>
              Gift Category
            </label>
            <select
              className={cn('mt-1 w-full max-w-sm rounded-md border p-3 text-neutral-content', {
                'bg-base-100 text-base-content': theme === 'corporate',
              })}
              name='giftCategory'
              onChange={handleCategoryChange}
              defaultValue=''
              required>
              <option
                disabled
                value=''>
                Pick this gift's category
              </option>
              {eventData.giftCategories.map((category: string, index: number) => (
                <option
                  key={index}
                  value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor='link'
              className='block font-medium text-base-content'>
              Link <span className='text-sm'>(ex: Amazon)</span>
            </label>
            <input
              id='link'
              name='link'
              type='text'
              autoComplete='off'
              className='mt-1 w-full max-w-sm rounded-md border p-2'
              value={gift.link}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor='price'
              className='block font-medium text-base-content'>
              Price <span className='text-sm'>(ex: $20.00)</span>
            </label>
            <input
              id='price'
              name='price'
              type='text'
              autoComplete='off'
              className='mt-1 w-full max-w-sm rounded-md border p-2'
              value={gift.price}
              onChange={handleInputChange}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <label
                htmlFor='anonymous'
                className='block font-medium text-base-content'>
                Request Anonymously?
              </label>
              <input
                id='anonymous'
                name='anonymous'
                type='checkbox'
                autoComplete='off'
                className='checkbox checkbox-md'
                checked={gift.anonymous}
                onChange={(e) => setGift({ ...gift, anonymous: e.target.checked })}
              />
            </div>
            <p className='text-sm text-base-content'>
              If you check this box, your name will not be shown to other users unless they claim
              this gift.
            </p>
          </div>
          <div className='flex w-full items-center justify-center gap-2'>
            {loading ? (
              <span className='loading loading-spinner loading-lg'></span>
            ) : (
              <>
                <button
                  type='submit'
                  className='btn btn-primary'>
                  Add Gift
                </button>
                <button
                  className='btn btn-neutral text-neutral-content'
                  onClick={() => setVisible(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddGiftModal;

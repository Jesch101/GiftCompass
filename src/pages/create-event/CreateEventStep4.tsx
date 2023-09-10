import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, addOwnedEvent } from '@/utils/firestore-operations';
import { useEvent } from '@/context/EventContext';
import { PiCaretLeft } from 'react-icons/pi';
import { useAuth } from '@/context/AuthContext';

const CreateEventStep4 = () => {
  const { eventData, setStep } = useEvent();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<string>('');
  const [disableCreate, setDisableCreate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleEventCreation = () => {
    setDisableCreate(true);
    setLoading(true);
    createEvent(eventData)
      .then(async (res) => {
        await addOwnedEvent(currentUser.uid, res);
        return res;
      })
      .then((res) => {
        setStatus('success');
        setTimeout(() => {
          navigate(`/event/${res}`);
        }, 4000);
      })
      .catch((err: Error) => {
        console.error('Failed to create event:', err);
        setStatus('error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let timeoutId: any;
    if (status === 'error') {
      timeoutId = setTimeout(() => {
        setStatus('');
        setDisableCreate(false);
      }, 8000);
    }

    // Clean-up function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status, setStatus]);

  return (
    <div className='mb-2 w-full max-w-xl rounded-2xl bg-base-200 shadow-lg'>
      <div className='flex h-full flex-col items-center gap-4 p-4'>
        <h1 className='text-2xl font-semibold text-base-content'>Step 4: Confirm and Create</h1>
        <p className='text-center text-base text-base-content'>
          Please confirm that the information below is correct before creating your event.
        </p>

        <div className='w-[85%]'>
          <ul className='list-disc'>
            <li>
              <span className='font-semibold'>Name:</span> {eventData.name}
            </li>
            <li>
              <span className='font-semibold'>Description:</span>{' '}
              {eventData.description === '' ? 'N/A' : eventData.description}
            </li>
            <li>
              <span className='font-semibold'>Date:</span> {eventData.date?.toLocaleDateString()}
            </li>
            <li>
              <span className='font-semibold'>Gift Categories:</span>
              <ul>
                {eventData.giftCategories.map((category, index) => (
                  <li
                    className='pl-2'
                    key={index}>
                    {category}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        {status === 'error' ? (
          <div className='alert alert-error shadow-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
              fill='none'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>Uh oh! There was an issue creating the event. Please try again.</span>
          </div>
        ) : null}
        <div className='mt-6 flex space-x-4'>
          {loading ? (
            <span className='loading loading-spinner loading-sm'></span>
          ) : (
            <>
              {status === 'success' ? (
                <div className='alert alert-success shadow-lg'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 shrink-0 stroke-current'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>Your event was successfully created! Redirecting... </span>
                  <span className='loading loading-spinner loading-sm'></span>
                </div>
              ) : (
                <>
                  <button
                    className='btn btn-secondary'
                    onClick={() => setStep(3)}>
                    <span>
                      <PiCaretLeft />
                    </span>
                    Back
                  </button>
                  <button
                    className='btn btn-success'
                    onClick={handleEventCreation}
                    disabled={disableCreate}>
                    Confirm
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventStep4;

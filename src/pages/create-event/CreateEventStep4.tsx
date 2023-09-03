import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvent } from '@/context/EventContext';
import { PiCaretLeft } from 'react-icons/pi';
import { FaCheck } from 'react-icons/fa6';

const CreateEventStep4 = () => {
  const { eventData, setStep } = useEvent();

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
        <div className='mt-6 flex space-x-4'>
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
            onClick={() => console.log(eventData)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventStep4;

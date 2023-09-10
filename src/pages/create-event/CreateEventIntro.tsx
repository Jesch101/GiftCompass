import React from 'react';
import { BsFillCalendarPlusFill } from 'react-icons/bs';
import StepIndicator from './StepIndicator';
import { Link } from 'react-router-dom';
import { useEvent } from '@/context/EventContext';

const CreateEventIntro = () => {
  const { setStep } = useEvent();
  return (
    <div className='flex flex-col items-center justify-center sm:h-[calc(100vh-68px-80px)]'>
      {/* Header */}
      <h1 className='mb-4 text-3xl font-bold'>Create Your Event</h1>

      {/* Iconography */}
      <div className='mb-4'>
        <BsFillCalendarPlusFill className='text-4xl text-primary' />
      </div>
      <StepIndicator />

      {/* Text Elements */}
      <p className='mb-2 text-center'>
        In just a few steps, you can set up an event and start inviting people.
      </p>
      <p className='mb-4 text-sm text-base-content'>Estimated time: 5 minutes</p>

      {/* Call to Action */}
      <div className='mt-6 flex space-x-4'>
        <button
          className='btn btn-primary'
          onClick={() => setStep(1)}>
          Start
        </button>
        <Link
          className='btn btn-neutral'
          to='/'>
          Cancel
        </Link>
      </div>

      {/* Optional FAQ/Help link
      <div className='mt-4'>
        <Link
          to='/faq'
          className='text-sm text-base-content underline'>
          Need Help? (Link to FAQ)
        </Link>
      </div> */}
    </div>
  );
};

export default CreateEventIntro;

import React from 'react';
import { cn } from '@/lib/utils';
import { useEvent } from '@/context/EventContext';

const StepIndicator = () => {
  const { step } = useEvent();

  return (
    <ul className='steps steps-vertical mb-4 lg:steps-horizontal'>
      <li className={cn('step step-primary')}>Basic Information</li>
      <li
        className={cn('step', {
          'step-primary': step >= 2,
        })}>
        Date and Time
      </li>
      <li
        className={cn('step', {
          'step-primary': step >= 3,
        })}>
        Gift Preferences
      </li>
      <li
        className={cn('step', {
          'step-primary': step >= 4,
        })}>
        Confirm and Create
      </li>
    </ul>
  );
};

export default StepIndicator;

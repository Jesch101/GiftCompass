import { useEffect } from 'react';
import StepIndicator from './StepIndicator';
import CreateEventIntro from './CreateEventIntro';
import CreateEventStep1 from './CreateEventStep1';
import CreateEventStep2 from './CreateEventStep2';
import CreateEventStep3 from './CreateEventStep3';
import CreateEventStep4 from './CreateEventStep4';
import { useEvent } from '@/context/EventContext';

const CreateEventContainer = () => {
  const { step } = useEvent();
  const stepsComponents: { [key: number]: JSX.Element } = {
    0: <CreateEventIntro />,
    1: <CreateEventStep1 />,
    2: <CreateEventStep2 />,
    3: <CreateEventStep3 />,
    4: <CreateEventStep4 />,
  };

  return (
    <div className='container min-h-[calc(100vh-68px-80px)]'>
      {step !== 0 ? (
        <div className=' flex flex-col items-center'>
          <div className='sm:mb-2 sm:mt-6'>
            <StepIndicator />
          </div>
          <div className='flex h-full w-full justify-center'>{stepsComponents[step]}</div>
        </div>
      ) : (
        <>{stepsComponents[step]}</>
      )}
    </div>
  );
};

export default CreateEventContainer;

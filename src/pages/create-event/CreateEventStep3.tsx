import React, { useState, useEffect } from 'react';
import { useEvent } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { PiCaretRight, PiCaretLeft } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa6';

const CreateEventStep3 = () => {
  const [error, setError] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const giftsList = [
    'Tech & Gadgets',
    'Fashion & Clothing',
    'Beauty & Skincare',
    'Sports & Outdoors',
    'Home & Kitchen',
    'Books & Literature',
    'Food & Drink',
    'Health & Wellness',
    'Hobbies & Crafts',
    'Travel & Experiences',
    'Miscellaneous',
  ];
  const { setStep, setEventData, eventData } = useEvent();
  const [unselected, setUnselected] = useState<string[]>(
    giftsList.filter((item) => !eventData.giftCategories.includes(item))
  );
  const [selected, setSelected] = useState<string[]>(eventData.giftCategories);

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  };

  const handleSelect = (item: string) => {
    const newUnselected = unselected.filter((pref) => pref !== item);
    const newSelected = [...selected, item];
    setUnselected(newUnselected);
    setSelected(newSelected);
  };

  const handleUnselect = (item: string) => {
    const newSelected = selected.filter((pref) => pref !== item);
    const newUnselected = [...unselected, item];
    setSelected(newSelected);
    setUnselected(newUnselected);
  };

  const handleNext = () => {
    if (selected.length > 0) {
      setEventData({ ...eventData, giftCategories: selected });
      setStep(4);
    }
  };

  const handleBack = () => {
    setEventData({ ...eventData, giftCategories: selected });
    setStep(2);
  };

  useEffect(() => {
    if (selected.length > 0) {
      setError(false);
      setErrorMessage(null);
    } else {
      setError(true);
      setErrorMessage('Please select at least one gift preference option');
    }
  }, [selected, setSelected]);

  return (
    <div className='mb-12 w-full max-w-5xl rounded-2xl bg-base-200 shadow-lg'>
      <div className='flex h-full flex-col items-center gap-4 p-4'>
        <h1 className='text-2xl font-semibold text-base-content'>Step 3: Gift Preferences</h1>
        <div className='w-full max-w-xl'>
          <p className='text-center text-base-content'>
            Next step is deciding what kind of gifts you want to allow for this event! You can
            select as many as you want, but you must select at least one.
          </p>
        </div>
        <div className='my-4 flex w-full flex-col'>
          <div className='mx-auto w-full md:w-[95%]'>
            <h1 className='mb-2 text-xl font-bold'>Selected Gift Categories</h1>
            {selected.length === 0 ? (
              <div className='alert w-fit bg-neutral text-neutral-content'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='h-6 w-6 shrink-0 stroke-info'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                </svg>
                <span>
                  Haven't selected any gift preferences yet? Click on the icons below to add them
                  here!
                </span>
              </div>
            ) : null}
            <div className='columns-4 gap-2'>
              <AnimatePresence>
                {selected.map((item) => (
                  <motion.button
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    variants={itemVariants}
                    onClick={() => handleUnselect(item)}
                    key={item}
                    className='mb-2 flex h-fit w-fit flex-row items-center gap-2 rounded border bg-base-100 p-2 align-middle hover:bg-base-300 hover:text-base-content'>
                    <FaMinus />
                    {item}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className='divider'></div>

          <div className='mx-auto w-full md:w-[95%]'>
            <h1 className='mb-2 text-xl font-bold'>Gift Categories</h1>
            <div className='columns-1 gap-2 sm:columns-2 md:columns-4'>
              <AnimatePresence>
                {unselected.map((item) => (
                  <motion.button
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    variants={itemVariants}
                    onClick={() => handleSelect(item)}
                    key={item}
                    className='mb-2 flex h-fit w-fit flex-row items-center gap-2 rounded border bg-base-100 p-2 align-middle hover:bg-base-300 hover:text-base-content'>
                    <span>
                      <FaPlus />
                    </span>
                    {item}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className='flex flex-row gap-4'>
          <button
            className='btn btn-secondary'
            onClick={handleBack}>
            <span>
              <PiCaretLeft />
            </span>
            Back
          </button>
          <div
            className='tooltip tooltip-error'
            data-tip={errorMessage}>
            <button
              className={cn('btn btn-primary', {
                'btn-disabled': error,
              })}
              onClick={handleNext}>
              Next
              <span>
                <PiCaretRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventStep3;

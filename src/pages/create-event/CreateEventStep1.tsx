import React, { useEffect, useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { PiCaretRight, PiCaretLeft } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { useTheme } from '@/context/ThemeContext';

const CreateEventStep1 = () => {
  const { eventData, setEventData, setStep } = useEvent();
  const [nameError, setNameError] = useState<boolean | string>(true);
  const [descriptionError, setDescriptionError] = useState<boolean | string>(true);
  const [displayErrorList, setDisplayErrorList] = useState<string[]>([]);

  const { theme } = useTheme();

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEventData({ ...eventData, [name]: value });

    if (value.length < 3) {
      setNameError("Event name can't be less than 3 characters");
    } else if (value.length > 50) {
      setNameError("Event name can't be more than 50 characters");
    } else {
      setNameError(false);
    }
  };

  const handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEventData({ ...eventData, [name]: value });
    if (value.length > 1000) {
      setDescriptionError("Event description can't be more than 1000 characters");
    } else {
      setDescriptionError(false);
    }
  };

  const handleDisplayErrorList = () => {
    let errors: string[] = [];
    if (typeof nameError === 'string') {
      errors.push(nameError);
    }
    if (typeof descriptionError === 'string') {
      errors.push(descriptionError);
    }
    setDisplayErrorList(errors);
  };

  useEffect(() => {
    let timeoutId: any;
    if (displayErrorList.length > 0) {
      timeoutId = setTimeout(() => {
        setDisplayErrorList([]);
      }, 4000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [displayErrorList]);

  useEffect(() => {
    // On page load, check if the errors need to be toggled on or off based on prior input
    if (eventData.name.length > 3 && eventData.name.length < 50) {
      setNameError(false);
    }
    if (eventData.description.length < 1000) {
      setDescriptionError(false);
    }
  }, []);

  const passwordInfo =
    'Set a password for your event. Share with guests for access. Use a mix of letters, numbers, and symbols for security.';

  return (
    <div
      className={cn('mb-2 w-full max-w-xl rounded-2xl bg-base-200 shadow-lg', {
        'bg-neutral text-neutral-content': theme === 'night',
      })}>
      <div className='flex h-full flex-col items-center gap-2 p-4'>
        <h1 className='text-2xl font-semibold text-base-content'>Step 1: Basic Information</h1>
        <p className='text-center text-base text-base-content'>
          Let's start with the basics. Fill in the information below to get started.
        </p>
        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Event Name</span>
          </label>
          <input
            type='text'
            placeholder='Name'
            name='name'
            autoComplete='off'
            minLength={3}
            maxLength={50}
            required
            defaultValue={eventData.name}
            onChange={handleNameChange}
            onBlur={handleDisplayErrorList}
            className='input input-bordered w-full max-w-xs'
          />
        </div>
        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Event Description</span>
          </label>
          <textarea
            placeholder='Description'
            name='description'
            minLength={10}
            maxLength={1000}
            required
            autoComplete='off'
            defaultValue={eventData.description}
            onChange={handleDescriptionChange}
            onBlur={handleDisplayErrorList}
            className='textarea textarea-bordered w-full max-w-xs text-[1rem]'
          />
        </div>
        {displayErrorList.length > 0 ? (
          <div className='alert alert-error flex w-full max-w-md flex-row gap-2 p-2'>
            <button
              className='btn btn-circle btn-error'
              onClick={() => setDisplayErrorList([])}>
              <FaRegCircleXmark className='h-6 w-6 shrink-0 stroke-current' />
            </button>
            <ul className='list-inside list-disc '>
              {displayErrorList.map((error, index) => (
                <li
                  className='text-sm '
                  key={index}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className='flex flex-row gap-4'>
          <button
            className='btn btn-secondary'
            onClick={() => setStep(0)}>
            <span>
              <PiCaretLeft />
            </span>
            Back
          </button>
          <div
            className='tooltip tooltip-error'
            data-tip={descriptionError || nameError ? 'Fill in all the fields to continue' : null}>
            <button
              className={cn('btn btn-primary', {
                'btn-disabled': descriptionError || nameError,
              })}
              onClick={() => setStep(2)}>
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

export default CreateEventStep1;

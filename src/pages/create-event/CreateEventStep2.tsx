import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { cn } from '@/lib/utils';
import { PiCaretRight, PiCaretLeft } from 'react-icons/pi';
import { useEvent } from '@/context/EventContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@/context/ThemeContext';
import dayjs from 'dayjs';

const CreateEventStep2 = () => {
  const { theme } = useTheme();
  const { setStep, eventData, setEventData } = useEvent();

  const [error, setError] = useState<string | null>(
    eventData?.date ? '' : 'Fill in all the fields to continue'
  );

  const handleManualDateChange = (newValue: any, context: any) => {
    if (!context.validationError) {
      setError('');
      setEventData({ ...eventData, date: newValue });
    } else {
      switch (context.validationError) {
        case 'invalidDate':
          setError('Invalid date');
          break;
        case 'minDate':
          setError('Date must be after today');
          break;
        case 'maxDate':
          setError('Date is too far in the future');
          break;
        case 'disablePast':
          setError('Date must be after today');
          break;
        default:
          setError('');
      }
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: theme === 'night' ? 'dark' : 'light',
    },
  });

  return (
    <div className='mb-2 w-full max-w-xl rounded-2xl bg-base-200 shadow-lg'>
      <div className='flex h-full flex-col items-center gap-4 p-4'>
        <h1 className='text-2xl font-semibold text-base-content'>Step 2: Date and Time</h1>
        <p className='text-center text-base text-base-content'>
          Next step is deciding when your event will take place! You can choose a date and time for
          your event.
        </p>
        <div className='form-control w-full max-w-xs'>
          <ThemeProvider theme={darkTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Event Date'
                disablePast
                slotProps={{
                  textField: {
                    helperText: `${error}`,
                  },
                }}
                sx={{
                  svg: {
                    color: 'hsl(var(--bc))',
                  },
                  input: {
                    color: 'hsl(var(--bc))',
                  },
                  label: {
                    color: 'hsl(var(--bc))',
                  },
                }}
                onAccept={(newDate) => {
                  if (newDate) setEventData({ ...eventData, date: newDate.toDate() });
                }}
                onChange={handleManualDateChange}
                value={dayjs(eventData?.date) ?? null}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>
        <div className='flex flex-row gap-4'>
          <button
            className='btn btn-secondary'
            onClick={() => setStep(1)}>
            <span>
              <PiCaretLeft />
            </span>
            Back
          </button>
          <div
            className='tooltip tooltip-error'
            data-tip={!eventData.date ? 'Fill in all the fields to continue' : null}>
            <button
              className={cn('btn btn-primary', {
                'btn-disabled': error,
              })}
              onClick={() => setStep(3)}>
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

export default CreateEventStep2;

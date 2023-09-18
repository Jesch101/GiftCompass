import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface EditDropdownProps {
  setDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDropdown: React.FC<EditDropdownProps> = ({ setDeleteVisible }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const handleEventDelete = () => {
    setDeleteVisible(true);
    closeDropdown();
  };

  useEffect(() => {
    function handleDocumentClick(event: Event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <div
      className='dropdown sm:dropdown-end'
      ref={dropdownRef}>
      <label
        tabIndex={0}
        className='btn btn-secondary btn-sm relative sm:btn-md'
        onClick={toggleDropdown}>
        Edit
      </label>
      {open && (
        <ul
          tabIndex={0}
          className={cn(
            'menu dropdown-content rounded-box z-[1] mt-1 w-52 bg-base-200 p-2 shadow-lg',
            {
              'bg-neutral text-neutral-content': theme === 'night',
            }
          )}>
          <li className='mb-2'>
            <a
              className='bg-info text-info-content'
              onClick={closeDropdown}>
              Change event details
            </a>
          </li>
          <li>
            <a
              className='bg-error text-error-content'
              onClick={handleEventDelete}>
              Delete Event
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default EditDropdown;

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { BsPersonFillAdd } from 'react-icons/bs';
import { FaCopy } from 'react-icons/fa6';
import { Modal } from '@mui/material';

interface ManageDropdownProps {
  setDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>;
  eventData: any;
}

const ManageDropdown: React.FC<ManageDropdownProps> = ({ setDeleteVisible, eventData }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [openInvite, setOpenInvite] = useState<boolean>(false);
  const [visibleCopy, setVisibleCopy] = useState<boolean>(false);
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

  const handleOpenInvite = () => {
    closeDropdown();
    setOpenInvite(true);
  };

  const handleCloseInvite = () => {
    setOpenInvite(false);
    setVisibleCopy(false);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(eventData?.password);
    setVisibleCopy(true);
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
    <>
      <Modal
        open={openInvite}
        onClose={handleCloseInvite}>
        <div
          className={cn(
            'prose absolute left-[50%] top-[50%] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-scroll overflow-y-auto rounded-lg border bg-neutral px-12 py-4 text-neutral-content shadow-lg',
            {
              'bg-base-100 text-base-content': theme === 'corporate',
            }
          )}>
          <h3>Invite others with password</h3>
          <div className='mt-2'>
            <p>
              At the moment, we only support password-based invites. Please share the password below
              with your friends and family.
            </p>
            <div>
              Password (click to copy):
              <a
                className='not-prose flex cursor-pointer items-center gap-1 align-middle font-bold normal-case text-info'
                onClick={copyPassword}>
                <span>
                  <FaCopy />
                </span>
                {eventData.password}
                <span>
                  {visibleCopy ? <span className='pl-1 text-success'>Copied!</span> : null}
                </span>
              </a>
            </div>
          </div>
        </div>
      </Modal>
      <div
        className='dropdown sm:dropdown-end'
        ref={dropdownRef}>
        <label
          tabIndex={0}
          className='btn btn-secondary btn-sm relative sm:btn-md'
          onClick={toggleDropdown}>
          Manage
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
    </>
  );
};

export default ManageDropdown;

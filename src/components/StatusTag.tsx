import React from 'react';
import { cn } from '@/lib/utils';
import { FaQuestion, FaCheck, FaExclamation } from 'react-icons/fa';

interface StatusTagProps {
  status: 'claimed' | 'unclaimed' | 'requested';
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const iconSize: number = 10;
  const capitalize = (s: string | null) => (s && s[0].toUpperCase() + s.slice(1)) || '';
  return (
    <div
      className={cn('badge gap-2 font-semibold', {
        'badge-success': status === 'claimed',
        'badge-error': status === 'unclaimed',
        'badge-warning': status === 'requested',
      })}>
      {status === 'claimed' && (
        <FaCheck
          className='inline-block'
          size={iconSize}
        />
      )}
      {status === 'unclaimed' && (
        <FaExclamation
          className='inline-block'
          size={iconSize}
        />
      )}
      {status === 'requested' && (
        <FaQuestion
          className='inline-block'
          size={iconSize}
        />
      )}
      {capitalize(status)}
    </div>
  );
};

export default StatusTag;

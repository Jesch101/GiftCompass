import React, { useState, ReactNode } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
  title: string; // Title of the card
  children: ReactNode; // Collapsible content
  open?: boolean; // Optional: whether the card is open by default
  btnText?: string; // Optional: text for an additional button next to the toggle button
  onBtnClick?: () => void; // Optional: click handler for the additional button
  className?: string; // Optional: additional CSS classess
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  children,
  open,
  btnText,
  onBtnClick,
  className,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open || false);

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl bg-base-100 p-4 text-base-content shadow-lg',
        className
      )}>
      <div className={cn('flex flex-row items-center justify-between')}>
        <div className='flex flex-row items-center gap-4'>
          <h1 className={cn('p-2 text-3xl font-bold')}>{title}</h1>
          {btnText && (
            <button
              onClick={onBtnClick}
              className={cn('btn btn-primary btn-sm')}>
              <FaPlus />
              <span>{btnText}</span>
            </button>
          )}
        </div>
        <div className={cn('flex items-center gap-4')}>
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn('btn btn-ghost btn-sm')}>
            {isOpen ? <FaMinus /> : <FaPlus />}
          </button>
        </div>
      </div>

      {/* Conditional rendering & CSS transition for the card */}
      <div
        className={cn(
          'transition-max-height overflow-hidden duration-500 ease-in-out',
          isOpen ? 'max-h-screen' : 'mt-4 max-h-0'
        )}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleCard;

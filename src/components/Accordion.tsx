import React, { useState, ReactNode } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string; // Title of the accordion item
  children: ReactNode; // Content of the accordion item
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='mx-1 my-2 overflow-x-auto rounded-xl'>
      {/* Title */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between text-left'>
        <h1 className='text-lg font-bold'>{title}</h1>
        {isOpen ? <FaMinus size={18} /> : <FaPlus size={18} />}
      </button>

      {/* Content */}
      <div
        className={cn(
          'transition-max-height overflow-hidden duration-500 ease-in-out',
          isOpen ? 'mt-4 max-h-screen' : 'max-h-0'
        )}>
        {children}
      </div>
    </div>
  );
};

interface AccordionProps {
  items: Array<{ title: string; content: ReactNode }>;
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;

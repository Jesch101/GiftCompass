import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className='overflow-x-auto rounded-xl bg-base-100 p-4 text-base-content'>
      {children}
    </div>
  );
};

export default Card;

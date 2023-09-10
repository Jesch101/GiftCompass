import React from 'react';

interface ErrorProps {
  errorCode: number;
}

const ErrorPage: React.FC<ErrorProps> = ({ errorCode }) => {
  const errorMessages: { [key: number]: string } = {
    404: 'Page not found',
    500: 'Internal server error',
    401: 'Unauthorized',
  };

  return (
    <div className='container flex h-[calc(100vh-68px)] flex-col items-center justify-center'>
      <h1 className='text-6xl font-bold'>{errorCode}</h1>
      <p className='text-2xl'>{errorMessages[errorCode]}</p>
    </div>
  );
};

export default ErrorPage;

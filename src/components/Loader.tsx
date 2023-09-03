import React from 'react';

const Loader = () => {
  return (
    <div className='absolute left-[50%] top-[50%]'>
      <span className='loading loading-spinner loading-lg'></span>
    </div>
  );
};

export default Loader;

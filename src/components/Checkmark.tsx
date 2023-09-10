import { motion } from 'framer-motion';

const Checkmark = () => {
  return (
    <div className='m-auto'>
      <motion.svg
        xmlns='http://www.w3.org/2000/svg'
        width='150'
        height='150'
        viewBox='0 0 258 258'>
        {/* Check mark */}
        <motion.path
          transform='translate(60 85)'
          d='M3 50L45 92L134 3'
          fill='transparent'
          stroke='#fff'
          strokeWidth={8}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
        {/* Circle */}
        <motion.path
          d='M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z'
          fill='transparent'
          strokeWidth='8'
          stroke='#fff'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      </motion.svg>
    </div>
  );
};

export default Checkmark;

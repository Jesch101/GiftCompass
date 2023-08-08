import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/GC_Logo.svg';

const Navbar = () => {
  const [auth, setAuth] = useState(true);

  return (
    <nav className='mx-auto container mt-8'>
      <div className='flex flex-row space-x-16'>
        <Link
          to='/'
          className='no-underline normal-case'>
          <img
            className='hidden lg:block md:w-32 lg:w-48 xl:w-64 h-auto'
            src={logo}
            alt='logo'
          />
        </Link>
        <div className='flex flex-row items-center space-x-11 flex-grow justify-center'>
          {auth && (
            <>
              <Link className='text-light-silver hover:text-soap duration-500 text-xl'>
                Dashboard
              </Link>
              <Link className='text-light-silver hover:text-soap duration-500 text-xl'>
                My Events
              </Link>
              <Link className='text-light-silver hover:text-soap duration-500 text-xl'>
                Join Events
              </Link>
            </>
          )}
          <Link className='text-light-silver hover:text-soap duration-500 text-xl'>
            About Us
          </Link>
          <Link className='text-light-silver hover:text-soap duration-500 text-xl'>
            FAQ
          </Link>
        </div>
        <div className='flex items-center flex-grow justify-center'>
          <button
            type='button'
            className='bg-cerulean hover:bg-sky-800 text-soap hover:text-light-silver duration-500 py-2 px-4 rounded'>
            {auth ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

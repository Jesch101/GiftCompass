import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/GC_Logo.svg';

const Navbar = () => {
  const [auth, setAuth] = useState(true);

  return (
    <nav className='mx-auto container mt-8 border border-blue'>
      <div className='flex flex-row space-x-16'>
        <Link
          to='/'
          className='no-underline normal-case'>
          <img
            src={logo}
            alt='logo'
          />
        </Link>
        <div className='flex flex-row items-center space-x-12'>
          {auth && (
            <>
              <Link className='text-light-silver hover:text-soap text-xl'>
                Dashboard
              </Link>
              <Link className='text-light-silver hover:text-soap text-xl'>
                My Events
              </Link>
              <Link className='text-light-silver hover:text-soap text-xl'>
                Join Events
              </Link>
            </>
          )}
          <Link className='text-light-silver hover:text-soap text-xl'>
            About Us
          </Link>
          <Link className='text-light-silver hover:text-soap text-xl'>FAQ</Link>
        </div>
        <div className='flex items-center'>
          <button
            type='button'
            className='bg-cerulean hover:bg-sky-800 text-soap hover:text-light-silver py-2 px-4 rounded'>
            {auth ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

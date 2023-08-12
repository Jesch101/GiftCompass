import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/SVG Logo.svg';

const Header = () => {
  const [auth, setAuth] = useState<boolean>(true);

  return (
    <header className='sticky top-0 z-50 mt-1 w-full bg-base-100 bg-opacity-90 shadow-sm backdrop-blur transition-all duration-100'>
      <div className='container flex h-16 items-center justify-center'>
        <div className='mr-4 hidden md:flex'>
          <Link
            to='/'
            className='btn btn-ghost mr-6 flex items-center space-x-2 normal-case no-underline'>
            <img
              className='h-auto w-8'
              src={logo}
              alt='logo'
            />
            <span className='primary-content hidden text-xl font-bold sm:inline-block'>
              GiftCompass
            </span>
          </Link>
          <nav className='flex items-center space-x-6 font-medium'>
            {auth ? (
              <>
                <Link
                  to='/explore'
                  className='btn btn-ghost normal-case transition-colors '>
                  Dashboard
                </Link>
                <Link
                  to='/create'
                  className='btn btn-ghost normal-case transition-colors '>
                  Create Event
                </Link>
                <Link
                  to='/my-events'
                  className='btn btn-ghost normal-case transition-colors '>
                  My Events
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/explore'
                  className='btn btn-ghost normal-case transition-colors '>
                  Explore Events
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            <button
              className='btn normal-case'
              onClick={() => setAuth(!auth)}>
              {auth ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

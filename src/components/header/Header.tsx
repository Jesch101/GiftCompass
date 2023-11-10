import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '@/assets/SVG Logo.svg';
import ProfileDropdown from './ProfileDropdown';
import ToggleTheme from './ToggleTheme';

const Header = () => {
  const { currentUser } = useAuth();
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
            {currentUser !== null ? (
              <>
                {/* <Link
                  to='/join-event'
                  className='btn btn-ghost normal-case transition-colors'>
                  Join Event
                </Link> */}
                <Link
                  to='/create-event'
                  className='btn btn-ghost normal-case transition-colors'>
                  Create Event
                </Link>
                <Link
                  to='/my-events'
                  className='btn btn-ghost normal-case transition-colors'>
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
        <div className='flex flex-1 flex-row items-center justify-between space-x-2 md:justify-end'>
          <ToggleTheme />
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            {currentUser === null ? (
              <Link
                to='/signin'
                className='btn btn-neutral normal-case'>
                Sign In
              </Link>
            ) : (
              <ProfileDropdown />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

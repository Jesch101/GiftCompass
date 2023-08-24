import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PiSignOutBold } from 'react-icons/pi';
import { FaRegUser } from 'react-icons/fa6';

const ProfileDropdown = () => {
  const { signOut, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      navigate('/signin', { replace: true });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className='dropdown dropdown-bottom sm:dropdown-end'>
      <label
        tabIndex={0}
        className='btn btn-ghost rounded-btn text-lg normal-case'>
        {loading || currentUser.displayName === null ? (
          <span className='loading loading-spinner loading-lg pt-2 text-white'></span>
        ) : (
          <p>Welcome, {currentUser?.displayName}</p>
        )}
      </label>
      <ul
        tabIndex={0}
        className='menu dropdown-content rounded-box z-[1] mt-2 w-52 bg-neutral p-2 font-semibold normal-case shadow'>
        <li>
          <Link to='/profile'>
            <FaRegUser
              size={16}
              className='mr-1'
            />
            View My Profile
          </Link>
        </li>
        <li>
          <a onClick={handleSignOut}>
            <PiSignOutBold
              size={16}
              className='mr-1'
            />
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;

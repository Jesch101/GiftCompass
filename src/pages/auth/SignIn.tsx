import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { BiErrorCircle } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import Checkmark from '@/components/Checkmark';
import { googleAuthError } from '@/utils/error-utils';
import User from '@/models/User';
import { addUser } from '@/utils/firestore-operations';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signinError, setSigninError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const { login, loading, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await login(email, password);
      setSuccess(true);
    } catch (error: any) {
      setErrorMessage('Invalid email or password. Please try again.');
      setSigninError(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();

      // Check if first time google login
      if (res.user.metadata.createdAt === res.user.metadata.lastLoginAt) {
        // Add user to firestore database
        const newUserInfo = res.user;
        const newUser: User = {
          id: newUserInfo.uid,
          name: newUserInfo.displayName,
          email: newUserInfo.email,
          signInType: 'google',
        };
        addUser(newUser);
      }

      setSuccess(true);
    } catch (error: any) {
      const errorMessage = googleAuthError(error.code);
      setErrorMessage(errorMessage);
      setSigninError(true);
    }
  };

  useEffect(() => {
    let timeoutId: any;
    if (success) {
      timeoutId = setTimeout(() => {
        navigate('/');
        setSuccess(false);
      }, 3000);
    }

    // Clean-up function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [success, setSuccess]);

  return (
    <div className='container flex h-[calc(100vh-68px)] flex-col items-center'>
      <div
        className={cn(
          'card mt-32 w-96 bg-neutral text-neutral-content transition-all duration-500',
          {
            'bg-success text-success-content': success,
          }
        )}>
        <div className='card-body space-y-4'>
          {success ? (
            <div className='flex flex-col items-center justify-center space-y-5 p-4'>
              <div className='card-title justify-center'>
                <Checkmark />
              </div>
              <h2 className='flex justify-center text-center text-4xl text-white'>
                Success! You're signed in. Redirecting...
              </h2>
              <span className='loading loading-spinner loading-lg pt-2 text-white'></span>
            </div>
          ) : (
            <>
              <h2 className='card-title justify-center text-3xl'>Sign In</h2>
              <div className='space-y-2'>
                <input
                  type='text'
                  placeholder='Email'
                  className='input w-full max-w-xs text-base-content'
                  onBlur={(e) => setEmail(e.target.value)}
                />
                <input
                  type='password'
                  placeholder='Password'
                  className='input w-full max-w-xs text-base-content'
                  onBlur={(e) => setPassword(e.target.value)}
                />
              </div>
              {signinError && (
                <div className='flex justify-center'>
                  <div className='alert alert-error text-sm'>
                    <BiErrorCircle className='h-6 w-6 shrink-0 stroke-current' />
                    <span>{errorMessage}</span>
                    <div>
                      <button
                        className='btn btn-square btn-ghost btn-sm'
                        onClick={() => setSigninError(false)}>
                        <FaXmark />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className='card-actions justify-start'>
                <button
                  onClick={handleSignIn}
                  className='btn btn-primary w-full'>
                  <span className={cn({ 'loading loading-spinner': loading })} />
                  Sign In
                </button>
              </div>
              <div className='divider'>OR</div>
              <div className='card-actions justify-center'>
                <button
                  className='btn btn-ghost'
                  onClick={handleGoogleSignIn}>
                  <FcGoogle className='h-8 w-8' />
                  Sign in with Google
                </button>
              </div>
              <div className='flex justify-center text-center text-lg'>
                <p>
                  Don't have an account?{' '}
                  <Link
                    to='/signup'
                    className='link'>
                    Sign Up
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;

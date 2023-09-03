import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { BiErrorCircle } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';
import Checkmark from '@/components/Checkmark';
import { useNavigate } from 'react-router-dom';
import { addUser } from '@/utils/firestore-utils';
import { firebaseAuthError, googleAuthError } from '@/utils/error-utils';
import User from '@/models/User';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordWrong, setIsPasswordWrong] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const { signUp, googleSignIn, updateUsername, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      // Firebase auth
      const res = await signUp(email, password);
      await updateUsername(username);

      // Add user to firestore database
      const newUserInfo = res.user;
      const newUser: User = {
        id: newUserInfo.uid,
        name: newUserInfo.displayName,
        email: newUserInfo.email,
        signInType: 'email',
      };
      addUser(newUser);

      setSuccess(true);
    } catch (error: any) {
      const errorMessage = firebaseAuthError(error.code);
      setErrorMessage(errorMessage);
      setSignupError(true);
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
      setSignupError(true);
    }
  };

  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== password) {
      setIsPasswordWrong(true);
    } else {
      setIsPasswordWrong(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/');
        setSuccess(false);
      }, 3000);
    }
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
                Success! You're signed in.
              </h2>
              <span className='loading loading-spinner loading-lg pt-2 text-white'></span>
            </div>
          ) : (
            <>
              <h2 className='card-title justify-center text-3xl'>Sign Up</h2>
              <div className='space-y-2'>
                <input
                  type='text'
                  placeholder='Username'
                  className='input w-full max-w-xs text-base-content'
                  onBlur={(e) => setUsername(e.target.value)}
                />
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
                <input
                  type='password'
                  placeholder='Confirm Password'
                  className={cn('input w-full max-w-xs text-base-content', {
                    'input-error': isPasswordWrong,
                    'input-success': confirmPassword === password && confirmPassword !== '',
                  })}
                  onBlur={handlePasswordCheck}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {signupError && (
                <div className='flex justify-center'>
                  <div className='alert alert-error text-sm'>
                    <BiErrorCircle className='h-6 w-6 shrink-0 stroke-current' />
                    <span>{errorMessage}</span>
                    <div>
                      <button
                        className='btn btn-square btn-ghost btn-sm'
                        onClick={() => setSignupError(false)}>
                        <FaXmark />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className='card-actions justify-start'>
                <button
                  onClick={handleSignUp}
                  className='btn btn-primary w-full'>
                  <span className={cn({ 'loading loading-spinner': loading })} />
                  Sign Up
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;

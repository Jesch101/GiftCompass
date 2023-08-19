import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { cn } from '@/lib/utils';
import { auth, googleProvider } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useAuth } from '../../context/AuthContex';
import { BiErrorCircle } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordWrong, setIsPasswordWrong] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { signUp, googleSignIn, updateUsername, loading } = useAuth();

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      await updateUsername(username);
    } catch (error: any) {
      let errorCode = error.code;
      let errorMessage = '';

      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage =
            'This email is already in use. Please use a different email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operation not allowed. Please contact support.';
          break;
        case 'auth/weak-password':
          errorMessage =
            'The password is too weak. Please use a stronger password.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again later.';
      }
      setErrorMessage(errorMessage);
      setSignupError(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error: any) {
      let errorCode = error.code;
      switch (errorCode) {
        case 'auth/cancelled-popup-request':
          setErrorMessage('Popup closed. Please try again.');
          break;
        case 'auth/popup-closed-by-user':
          setErrorMessage('Popup closed. Please try again.');
          break;
        case 'auth/popup-blocked':
          setErrorMessage('Popup blocked. Please enable popups and try again.');
          break;
        default:
          setErrorMessage('Error signing in with Google. Please try again.');
      }
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

  return (
    <div className='container flex h-[calc(100vh-68px)] flex-col items-center'>
      <div className='card mt-40 w-96 bg-neutral text-neutral-content'>
        <div className='card-body space-y-4'>
          <h2 className='card-title justify-center text-3xl'>Sign Up</h2>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Username'
              className='input w-full max-w-xs'
              onBlur={(e) => setUsername(e.target.value)}
            />
            <input
              type='text'
              placeholder='Email'
              className='input w-full max-w-xs'
              onBlur={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              className='input w-full max-w-xs'
              onBlur={(e) => setPassword(e.target.value)}
            />
            <input
              type='password'
              placeholder='Confirm Password'
              className={cn('input w-full max-w-xs', {
                'input-error': isPasswordWrong,
                'input-success':
                  confirmPassword === password && confirmPassword !== '',
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
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiInfo, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { deleteUser } from '@/utils/firestore-utils';

const ProfileInfo = () => {
  const {
    currentUser,
    verifyEmail,
    loading,
    deleteAccount,
    reauthenticateWithPassword,
  } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedUsername, setUpdatedUsername] = useState<string>('');
  const [updatedEmail, setUpdatedEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>(''); // Error for delete account
  const [verifySent, setVerifySent] = useState<boolean>(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string>(''); // Error for password change
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<string>(''); // Status for password change

  const deleteModalRef = useRef<HTMLDialogElement | null>(null);

  const handleNameUpdate = () => {
    if (updatedUsername !== '') {
      console.log(updatedUsername);
    }
  };

  const handleEmailUpdate = () => {
    if (updatedEmail !== '') {
      console.log(updatedEmail);
    }
  };

  // Email verification process
  const handleEmailVerification = async () => {
    try {
      setIsLoading(true);
      await verifyEmail();
      setIsLoading(false);
      setVerifySent(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleVerifyReload = async () => {
    try {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        window.location.reload();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const openDeleteModal = () => {
    if (deleteModalRef.current) {
      deleteModalRef.current.showModal();
    }
  };

  const closeDeleteModal = async () => {
    if (deleteModalRef.current) {
      deleteModalRef.current.close();
      setPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteModalRef.current) {
      deleteModalRef.current.close();
      try {
        await reauthenticateWithPassword(password);
        const userId = currentUser.uid;
        await deleteAccount();
        deleteUser(userId);
      } catch (error: any) {
        console.log('Error reauthenticating user: ', error);
        setError('It seems there was a problem. Please try again.');
      }
      setPassword('');
    }
  };

  useEffect(() => {
    if (error !== '') {
      setTimeout(() => {
        setError('');
      }, 4000);
    }
  }, [error]);

  return (
    <div className='h-full w-full p-16'>
      <div className='grid grid-cols-2 gap-x-8 gap-y-6'>
        <div className='col-span-2'>
          <div className='text-3xl text-neutral-content'>User Info (WIP)</div>
          <div className='divider mb-0 mt-0'></div>
        </div>
        {!currentUser.emailVerified ? (
          <div className='col-span-2'>
            {!verifySent ? (
              <div className='alert shadow-lg'>
                <FiInfo className='h-6 w-6 shrink-0 stroke-info' />
                <div>
                  <h3 className='text-md font-semibold'>
                    You haven't verified your email yet. To use the full app,
                    please verify your email.
                  </h3>
                </div>
                <button
                  className={cn('btn btn-info btn-sm normal-case', {
                    'btn-disabled': isLoading,
                  })}
                  onClick={handleEmailVerification}>
                  {isLoading ? (
                    <span className='loading loading-dots loading-md'></span>
                  ) : (
                    <p>Verify</p>
                  )}
                </button>
              </div>
            ) : (
              <>
                <h2 className='text-sm font-semibold'>
                  Verification email sent! Didn't get anything? Wait a minute
                  and check your inbox.
                </h2>
                <button
                  className='btn btn-success btn-sm mt-2 normal-case text-success-content'
                  onClick={handleVerifyReload}>
                  {isLoading ? (
                    <span className='loading loading-dots loading-md'></span>
                  ) : (
                    <p>Check status</p>
                  )}
                </button>
              </>
            )}
          </div>
        ) : null}
        <div className='col-span-1'>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>Change Display Username</span>
            </label>
            <div className='join'>
              <input
                type='text'
                placeholder={currentUser.displayName}
                onChange={(e) => setUpdatedUsername(e.target.value)}
                className='input join-item input-bordered w-full max-w-xs'
              />
              <button
                type='submit'
                className='btn btn-primary join-item cursor-not-allowed normal-case'
                onClick={handleNameUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className='col-span-1'>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>Change Email</span>
            </label>
            <div className='join'>
              <input
                type='text'
                placeholder={currentUser.email}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className='input join-item input-bordered w-full max-w-xs'
              />
              <button
                type='submit'
                className='btn btn-primary join-item cursor-not-allowed normal-case'
                onClick={handleEmailUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className='col-span-2 pt-8 '>
          <div className='text-3xl text-neutral-content'>Password Reset</div>
          <div className='divider mb-0 mt-0'></div>
        </div>
        <div className='col-span-2 flex flex-col gap-2 md:col-span-1'>
          <input
            type='password'
            placeholder='Old Password'
            className='input w-full max-w-sm'
          />
          <input
            type='password'
            placeholder='New Password'
            className='input w-full max-w-sm'
          />
        </div>
        <div className='col-span-2 flex flex-col gap-2 md:col-span-1'>
          <button className='btn btn-primary w-full max-w-xs cursor-not-allowed normal-case'>
            Confirm Password Change
          </button>
        </div>
        <div className='col-span-2 pt-8 '>
          <div className='text-3xl text-error'>Delete Account</div>
          <div className='divider mb-0 mt-0'></div>
        </div>
        <div className='col-span-2'>
          {/* Delete account modal */}
          <button
            className='btn btn-error btn-sm normal-case'
            onClick={openDeleteModal}>
            {loading ? (
              <span className='loading loading-spinner loading-sm'></span>
            ) : (
              <FiAlertCircle className='h-6 w-6' />
            )}
            Delete Account?
          </button>
          <div
            className={cn('transition-all duration-500', {
              'opacity-100': error,
              'opacity-0': !error,
            })}>
            <div className='alert alert-warning mt-2 w-full max-w-xl'>
              <FiAlertCircle className='h-6 w-6 shrink-0' />
              <span>{error}</span>
            </div>
          </div>
          <dialog
            ref={deleteModalRef}
            id='delete_modal'
            className='modal'>
            <form
              method='dialog'
              className='modal-box'>
              <h3 className='text-lg font-bold'>Confirm Deletion</h3>
              <p className='py-4'>
                Are you sure you want to delete your account? This action cannot
                be undone. To confirm, please enter your password.
              </p>
              <input
                className='input input-bordered w-full max-w-xs border-error'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
              <div className='modal-action'>
                <button
                  onClick={closeDeleteModal}
                  className='btn btn-ghost'>
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className='btn btn-error'>
                  Confirm
                </button>
              </div>
            </form>
            <form
              method='dialog'
              className='modal-backdrop'>
              <button>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

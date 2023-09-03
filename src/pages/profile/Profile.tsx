import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiInfo } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import ProfileInfo from './ProfileInfo';
import ProfileEvents from './ProfileEvents';
import ProfileGifts from './ProfileGifts';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const { currentUser } = useAuth();
  const username = currentUser.displayName;

  let tabContent;

  switch (activeTab) {
    case 1:
      tabContent = <ProfileInfo />;
      break;
    case 2:
      tabContent = <ProfileEvents />;
      break;
    case 3:
      tabContent = <ProfileGifts />;
      break;
    default:
      tabContent = <div>Uh oh! Something went very wrongwrong</div>;
  }

  return (
    <div className='h-[calc(100vh-68px)] w-screen'>
      <div className='flex h-full flex-row'>
        <aside className='flex min-h-full w-[30%] grow-0 flex-col items-end bg-base-100'>
          {/* Profile info section */}
          <div className='flex w-full justify-end'>
            <div className='mt-12 flex w-full max-w-[350px] flex-shrink-0 flex-col gap-3'>
              <div className='avatar'>
                <div className='w-20 rounded-full bg-primary text-primary-content'>
                  <div className='flex h-full w-full items-center justify-center'>
                    <p className='text-3xl font-medium'>{username?.charAt(0)}</p>
                  </div>
                </div>
              </div>
              <div className='text-2xl text-base-content'>{username}</div>
              {currentUser.emailVerified ? (
                <div className='badge badge-success badge-outline gap-2'>
                  <FiInfo size={16} />
                  Email verified
                </div>
              ) : (
                <div className='badge badge-error badge-outline gap-2'>
                  <FiInfo size={16} />
                  Email not yet verified
                </div>
              )}
            </div>
          </div>
          {/* Profile tabs */}
          <div className='flex w-full justify-end'>
            <ul className='mt-8 flex w-full max-w-[350px] flex-shrink-0 flex-col'>
              <li
                className={cn('cursor-pointer rounded-l-3xl p-4 hover:bg-base-300', {
                  'bg-base-200 text-base-content hover:bg-base-200': activeTab === 1,
                })}
                onClick={() => setActiveTab(1)}>
                <h2 className='text-xl font-semibold'>Edit Profile Info</h2>
                <p className='text-sm'>Personalize your details</p>
              </li>
              <li
                className={cn('cursor-pointer rounded-l-3xl p-4 hover:bg-base-300', {
                  'bg-base-200 text-base-content hover:bg-base-200': activeTab === 2,
                })}
                onClick={() => setActiveTab(2)}>
                <h2 className='text-xl font-semibold'>View My Events</h2>
                <p className='text-sm'>Explore your event list</p>
              </li>
              <li
                className={cn('cursor-pointer rounded-l-3xl p-4 hover:bg-base-300 ', {
                  'bg-base-200 text-base-content hover:bg-base-200': activeTab === 3,
                })}
                onClick={() => setActiveTab(3)}>
                <h2 className='text-xl font-semibold'>View My Gifts</h2>
                <p className='text-sm'>Browse your requested and claimed gifts</p>
              </li>
            </ul>
          </div>
        </aside>
        <main className='min-h-full grow rounded-tl-xl bg-base-200'>{tabContent}</main>
      </div>
    </div>
  );
};

export default Profile;

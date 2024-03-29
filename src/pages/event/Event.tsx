import React, { useState, useEffect, ReactNode } from 'react';
import { getEvent, getEventGifts } from '@/utils/firestore-operations';
import Loader from '@/components/Loader';
import AllGifts from './event-tabs/AllGifts';
import ClaimedGifts from './event-tabs/ClaimedGifts';
import RequestedGifts from './event-tabs/RequestedGifts';
import AddGiftModal from '@/components/AddGiftModal';
import { AiOutlineLink } from 'react-icons/ai';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { IoLink } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { convertSecondsToLocalDate } from '@/utils/utils';
import ConfirmEventDeleteModal from '@/components/event/ConfirmEventDeleteModal';
import ManageDropdown from '@/components/event/ManageDropdown';
import { useNavigate, useLocation } from 'react-router-dom';

import { generateInviteLink, deleteEvent } from '@/config/firebase';
import UnclaimedGifts from './event-tabs/UnclaimedGifts';

interface EventProps {
  id: string;
}

const Event: React.FC<EventProps> = ({ id }) => {
  const [eventData, setEventData] = useState<any>(null);
  const [eventGifts, setEventGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('unclaimed');
  const [showAddGiftModal, setShowAddGiftModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tabLoading, setTabLoading] = useState<boolean>(false);

  const [showDeleteEventModal, setShowDeleteEventModal] = useState<boolean>(false);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<boolean>(false);
  const [deleteEventLoading, setDeleteEventLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const [inviteCodeLoading, setInviteCodeLoading] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copyInviteCodeText, setCopyInviteCodeText] = useState<string>('Copy Invite Code');

  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [joinedAlertState, setJoinedAlertState] = useState<any>(location?.state?.joined || null);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const fetchedEventData = await getEvent(id);
      setEventData(fetchedEventData);
    } catch (err: any) {
      console.error('Error fetching event data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventGifts = async () => {
    setTabLoading(true);
    try {
      const fetchedEventGifts = await getEventGifts(id);
      setEventGifts(fetchedEventGifts);
    } catch (err: any) {
      console.error('Error fetching event gifts:', err.message);
      setError(err.message);
    } finally {
      setTabLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    setDeleteEventLoading(true);
    try {
      await deleteEvent({ eventId: id });
    } catch (err: any) {
      console.error('Error deleting event:', err.message);
      setDeleteError('There was an error deleting this event. Please try again.');
    } finally {
      setDeleteEventLoading(false);
      navigate('/my-events');
    }
  };

  const handleGetInviteLink = async () => {
    setInviteCodeLoading(true);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(currentDate.getTime() + oneDay);

    generateInviteLink({ eventId: id, expirationDate: expirationDate, singleUse: false })
      .then((res) => {
        setInviteCode(res.data as string);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setInviteCode('There was an error generating the invite code. Please try again.');
      })
      .finally(() => {
        setInviteCodeLoading(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteCode as string)
      .then(() => {
        setCopyInviteCodeText('Copied!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        setCopyInviteCodeText('Failed to copy');
      });
  };

  // Page load fetches
  useEffect(() => {
    Promise.all([fetchEventData(), fetchEventGifts()]);
    if (location.state?.joined) {
      // @ts-ignore
      navigate(null, { replace: true, state: {} });
      setTimeout(() => {
        setJoinedAlertState(null);
      }, 6000);
    }
  }, []);

  useEffect(() => {
    if (confirmDeleteEvent) {
      handleDeleteEvent();
    }
  }, [confirmDeleteEvent]);

  const renderTabContent = (): ReactNode => {
    switch (activeTab) {
      case 'all':
        return (
          <AllGifts
            gifts={eventGifts}
            refetchData={fetchEventGifts}
          />
        );
      case 'unclaimed':
        return (
          <UnclaimedGifts
            gifts={eventGifts}
            refetchData={fetchEventGifts}
          />
        );
      case 'claimed':
        return (
          <ClaimedGifts
            gifts={eventGifts}
            refetchData={fetchEventGifts}
          />
        );
      case 'requested':
        return (
          <RequestedGifts
            gifts={eventGifts}
            refetchData={fetchEventGifts}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error fetching event data.</p>;
  }

  return (
    <div className='flex min-h-[calc(100vh-68px-80px)] flex-col'>
      <AddGiftModal
        visible={showAddGiftModal}
        setVisible={setShowAddGiftModal}
        eventData={eventData}
        fetchEventGifts={fetchEventGifts}
      />
      <ConfirmEventDeleteModal
        visible={showDeleteEventModal}
        setVisible={setShowDeleteEventModal}
        setConfirmDelete={setConfirmDeleteEvent}
        deleteLoading={deleteEventLoading}
      />
      {joinedAlertState ? (
        <div className='alert alert-success fixed bottom-4 left-4 w-fit max-w-md'>
          <FaCheckCircle />
          <span>You have successfully joined the event!</span>
          <button
            className='btn btn-circle btn-ghost btn-sm'
            onClick={() => setJoinedAlertState(null)}>
            <FaXmark />
          </button>
        </div>
      ) : null}
      <div className='container mt-12 grid grid-cols-2 gap-4 text-base-content'>
        <div className='col-span-2 flex flex-col justify-center gap-8 sm:col-span-1 sm:justify-start'>
          <h1 className='text-5xl font-bold'>{eventData.name}</h1>
          {deleteError ? (
            <div className='flex flex-row gap-2'>
              <p className='text-lg'>{deleteError}</p>
              <button
                className='btn btn-outline btn-sm p-1 text-sm normal-case'
                onClick={() => setDeleteError('')}>
                Clear Error
              </button>
            </div>
          ) : null}
        </div>
        <div className='col-span-2 flex items-center justify-center gap-4 sm:col-span-1'>
          {currentUser.uid === eventData.ownerId ? (
            <>
              <div className='group relative'>
                {theme === 'night' ? (
                  <div className='duration-800 absolute inset-0 rounded-lg bg-secondary opacity-75 blur-sm transition group-hover:opacity-100'></div>
                ) : null}
                {eventData ? (
                  <ManageDropdown
                    setDeleteVisible={setShowDeleteEventModal}
                    eventData={eventData}
                  />
                ) : null}
              </div>

              <div className='group relative'>
                {theme === 'night' ? (
                  <div className='duration-800 absolute inset-0 rounded-lg bg-secondary opacity-75 blur-sm transition group-hover:opacity-100'></div>
                ) : null}
                <div className='dropdown relative'>
                  <label
                    tabIndex={0}
                    className='btn btn-secondary btn-sm relative sm:btn-md'>
                    <span>
                      <IoLink size={20} />
                    </span>
                    Invite
                  </label>
                  <ul
                    tabIndex={0}
                    className={cn(
                      'menu dropdown-content z-[1] mt-1 min-w-[13rem] rounded-box bg-base-200 p-2 shadow-lg',
                      {
                        'bg-neutral text-neutral-content': theme === 'night',
                      }
                    )}>
                    <li>
                      {inviteCodeLoading ? (
                        <div className='flex justify-center'>
                          <span className='loading loading-dots loading-sm'></span>
                        </div>
                      ) : !inviteCode ? (
                        <a
                          className='p-2'
                          onClick={handleGetInviteLink}>
                          <AiOutlineLink size={16} />
                          Generate Invite code
                        </a>
                      ) : null}
                      {inviteCode && !inviteCodeLoading ? (
                        <div className='flex flex-col gap-2'>
                          <div className='flex flex-row gap-2'>
                            <p className='text-base-content/50'>Invite code:</p>
                            <p className='text-base-content/75'>{inviteCode}</p>
                          </div>
                          <button
                            className='btn btn-outline btn-sm p-1 text-sm normal-case'
                            onClick={copyToClipboard}>
                            {copyInviteCodeText}
                          </button>
                        </div>
                      ) : null}
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : null}
          <div className='group relative'>
            {theme === 'night' ? (
              <div className='duration-800 absolute inset-0 rounded-lg bg-primary opacity-75 blur-sm transition group-hover:opacity-100'></div>
            ) : null}
            <button
              className='btn btn-primary btn-sm relative sm:btn-md'
              onClick={() => setShowAddGiftModal(true)}>
              <span>
                <FaPlus />
              </span>
              Add Gift
            </button>
          </div>
        </div>
        <div className='col-span-full flex flex-col gap-4'>
          <p className='text-xl'>{convertSecondsToLocalDate(eventData.date.seconds)}</p>
          <p>{eventData.description}</p>
        </div>
        <div className='col-span-full'>
          {eventData.giftCategories.length > 0 ? (
            <div className='flex flex-row flex-wrap items-center gap-3'>
              {eventData.giftCategories.map((category: any, index: number) => (
                <div
                  key={index}
                  className='group relative'>
                  <div
                    className={cn(
                      'duration-800 absolute inset-0 hidden rounded-full bg-primary opacity-75 blur group-hover:block'
                    )}>
                    {category}
                  </div>
                  <div className='badge badge-neutral relative hover:cursor-pointer'>
                    {category}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className='col-span-full justify-center border-b border-base-content/80 pb-[1px] sm:justify-start'>
          <div className='-m-[2px] flex flex-wrap items-end'>
            <a
              onClick={() => setActiveTab('all')}
              className={cn(
                'items-center border-b-2 border-transparent px-4 pb-4 pt-2 text-base-content/50 hover:cursor-pointer hover:border-neutral-content/50 hover:text-base-content/75',
                {
                  'border-primary text-base-content/100 hover:border-primary hover:text-base-content/100':
                    activeTab === 'all',
                }
              )}>
              All Gifts
            </a>
            <a
              onClick={() => setActiveTab('unclaimed')}
              className={cn(
                'items-center border-b-2 border-transparent px-4 pb-4 pt-2 text-base-content/50 hover:cursor-pointer hover:border-neutral-content/50 hover:text-base-content/75',
                {
                  'border-primary text-base-content/100 hover:border-primary hover:text-base-content/100':
                    activeTab === 'unclaimed',
                }
              )}>
              Unclaimed Gifts
            </a>
            <a
              onClick={() => setActiveTab('claimed')}
              className={cn(
                'items-center border-b-2 border-transparent px-4 pb-4 pt-2 text-base-content/50 hover:cursor-pointer hover:border-neutral-content/50 hover:text-base-content/75',
                {
                  'border-primary text-base-content/100 hover:border-primary hover:text-base-content/100':
                    activeTab === 'claimed',
                }
              )}>
              My Claimed Gifts
            </a>
            <a
              onClick={() => setActiveTab('requested')}
              className={cn(
                'items-center border-b-2 border-transparent px-4 pb-4 pt-2 text-base-content/50 hover:cursor-pointer hover:border-neutral-content/50 hover:text-base-content/75',
                {
                  'border-primary text-base-content/100 hover:border-primary hover:text-base-content/100':
                    activeTab === 'requested',
                }
              )}>
              My Requested Gifts
            </a>
          </div>
        </div>
        <section className='col-span-full'>
          <div className='mb-12'>
            {tabLoading ? (
              <div className='flex w-52 flex-col gap-4'>
                <div className='skeleton h-32 w-full'></div>
                <div className='skeleton h-4 w-28'></div>
                <div className='skeleton h-4 w-full'></div>
                <div className='skeleton h-4 w-full'></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Event;

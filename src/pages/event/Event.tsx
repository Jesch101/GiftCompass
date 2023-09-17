import React, { useState, useEffect, ReactNode } from 'react';
import { getEvent, getEventGifts } from '@/utils/firestore-operations';
import Loader from '@/components/Loader';
import AllGifts from './event-tabs/AllGifts';
import ClaimedGifts from './event-tabs/ClaimedGifts';
import RequestedGifts from './event-tabs/RequestedGifts';
import AddGiftModal from '@/components/AddGiftModal';
import { FaPlus } from 'react-icons/fa6';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { convertSecondsToLocalDate } from '@/utils/utils';

interface EventProps {
  id: string;
}

const Event: React.FC<EventProps> = ({ id }) => {
  const [eventData, setEventData] = useState<any>(null);
  const [eventGifts, setEventGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAddGiftModal, setShowAddGiftModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tabLoading, setTabLoading] = useState<boolean>(false);

  const { theme } = useTheme();
  const { currentUser } = useAuth();

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

  useEffect(() => {
    Promise.all([fetchEventData(), fetchEventGifts()]);
  }, []);

  const renderTabContent = (): ReactNode => {
    switch (activeTab) {
      case 'all':
        return (
          <AllGifts
            gifts={eventGifts}
            refetchData={fetchEventGifts}
          />
        );
      case 'claimed':
        return <ClaimedGifts />;
      case 'requested':
        return <RequestedGifts />;
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
      <div className='container mt-12 grid grid-cols-2 gap-4 text-base-content'>
        <div className='col-span-2 flex flex-row items-center justify-center gap-8 sm:col-span-1 sm:justify-start'>
          <h1 className='text-5xl font-bold'>{eventData.name}</h1>
        </div>
        <div className='col-span-2 flex items-center justify-center gap-4 sm:col-span-1'>
          {currentUser.uid === eventData.ownerId ? (
            <div className='group relative'>
              {theme === 'night' ? (
                <div className='duration-800 absolute inset-0 rounded-lg bg-secondary opacity-75 blur-sm transition group-hover:opacity-100'></div>
              ) : null}
              <button className='btn btn-secondary btn-sm relative sm:btn-md'>Edit</button>
            </div>
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
          {/* Check if eventData.giftCategories.length > 0, and map it if true*/}
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
              Overview
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
              Claimed Gifts
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
              Requested Gifts
            </a>
          </div>
        </div>
        <section className='col-span-full'>
          <div className='mb-12'>
            {tabLoading ? (
              <span className='loading loading-spinner loading-md'></span>
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

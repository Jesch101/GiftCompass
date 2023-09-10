import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserOwnedEvents } from '@/utils/firestore-operations';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { convertSecondsToLocalDate } from '@/utils/utils';

function isUpcomingDate(dateInSeconds: number) {
  const inputDate = new Date(dateInSeconds * 1000);
  inputDate.setHours(0, 0, 0, 0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() > currentDate.getTime()) {
    return 'Upcoming';
  } else if (inputDate.getTime() === currentDate.getTime()) {
    return 'Active';
  } else {
    return 'Passed';
  }
}

const EventsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [ownedEvents, setOwnedEvents] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string>('date-dec');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getOwnedEvents = async () => {
    try {
      const events = await getUserOwnedEvents(currentUser.uid);
      events.sort((a, b) => a.date.seconds + b.date.seconds);
      setOwnedEvents(events);
    } catch (error: any) {
      console.log('Error getting events: ', error.message);
    }
  };

  useEffect(() => {
    getOwnedEvents().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleEventClick = (eventId: any) => {
    navigate(`/event/${eventId}`);
  };

  const handleNameSort = () => {
    if (sortOption === 'name-asc' || sortOption === 'name-dec') {
      setSortOption(sortOption === 'name-asc' ? 'name-dec' : 'name-asc');
      setOwnedEvents(ownedEvents.reverse());
    } else {
      setSortOption('name-dec');
      setOwnedEvents(ownedEvents.sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const handleDateSort = () => {
    if (sortOption === 'date-asc' || sortOption === 'date-dec') {
      setSortOption(sortOption === 'date-asc' ? 'date-dec' : 'date-asc');
      setOwnedEvents(ownedEvents.reverse());
    } else {
      setSortOption('date-asc');
      setOwnedEvents(ownedEvents.sort((a, b) => a.date.seconds - b.date.seconds));
    }
  };

  return (
    <div className='min-h-[calc(100vh-68px-80px)] w-full bg-base-100'>
      <div className='flex w-full flex-col items-center gap-2 md:container'>
        {ownedEvents.length > 0 ? (
          <div className='container mx-auto px-4 sm:px-8'>
            <div className='py-8'>
              <div>
                <h2 className='text-2xl font-semibold leading-tight'>Your Events</h2>
              </div>
              <div className='-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8'>
                <div className='inline-block min-w-full overflow-hidden rounded-lg shadow-lg'>
                  <table className='min-w-full leading-normal'>
                    <thead className='border-b border-b-base-200 bg-neutral text-neutral-content'>
                      <tr>
                        <th className='px-5 py-3 text-left text-sm tracking-wider'>
                          <div className='flex flex-row items-center gap-2'>
                            Event Details
                            <button
                              className='btn btn-ghost btn-sm'
                              onClick={handleNameSort}>
                              {sortOption === 'name-asc' ? (
                                <FaSortUp />
                              ) : sortOption === 'name-dec' ? (
                                <FaSortDown />
                              ) : (
                                <FaSort />
                              )}
                            </button>
                          </div>
                        </th>
                        <th className='hidden px-5 py-3 text-left text-sm tracking-wider sm:table-cell'>
                          <div className='flex flex-row items-center gap-2'>Owner</div>
                        </th>
                        <th className='px-5 py-3 text-left text-sm tracking-wider'>
                          <div className='flex flex-row items-center gap-2'>
                            Event Date
                            <button
                              className='btn btn-ghost btn-sm'
                              onClick={handleDateSort}>
                              {sortOption === 'date-asc' ? (
                                <FaSortUp />
                              ) : sortOption === 'date-dec' ? (
                                <FaSortDown />
                              ) : (
                                <FaSort />
                              )}
                            </button>
                          </div>
                        </th>
                        <th className='px-5 py-3 text-left text-sm tracking-wider'>
                          <div className='flex flex-row items-center gap-2'>Status</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownedEvents.map((event: any) => (
                        <tr
                          key={event.id}
                          className='border-b border-neutral bg-base-200 last:border-none hover:cursor-pointer hover:bg-base-100'
                          onClick={() => handleEventClick(event.id)}>
                          <td className='whitespace-normal px-5 py-5 text-sm'>
                            <div className='flex'>
                              <div className='ml-3'>
                                <p className='text-lg text-base-content'>{event.name}</p>
                                <p className=' text-sm text-base-content'>{event.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className='hidden px-5 py-5 text-sm sm:table-cell'>
                            <p className='text-base-content'>{event.ownerDisplayName}</p>
                          </td>
                          <td className='px-5 py-5 text-sm'>
                            <p className='text-base-content'>
                              {convertSecondsToLocalDate(event.date.seconds)}
                            </p>
                          </td>
                          <td className='px-5 py-5 text-sm'>
                            <div
                              className={cn('badge', {
                                'badge-success': isUpcomingDate(event.date.seconds) === 'Upcoming',
                                'badge-primary': isUpcomingDate(event.date.seconds) === 'Active',
                                'badge-error': isUpcomingDate(event.date.seconds) === 'Passed',
                              })}>
                              {isUpcomingDate(event.date.seconds)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <h1 className='text-3xl font-bold'>Your Events</h1>
            <p className='text-base-content'>You have not created any events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

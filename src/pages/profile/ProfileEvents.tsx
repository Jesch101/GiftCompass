import React, { useState, useEffect } from 'react';
import CollapsibleCard from '@/components/CollapsibleCard';
import Card from '@/components/Card';
import Loader from '@/components/Loader';
import { useNavigate, Link } from 'react-router-dom';
import { getUserOwnedEvents } from '@/utils/firestore-operations';
import { useAuth } from '@/context/AuthContext';
import { convertSecondsToLocalDate } from '@/utils/utils';

const ProfileEvents = () => {
  const [invitations, setInvitations] = useState([]);
  const [events, setEvents] = useState<any>([]);
  const [claimedGifts, setClaimedGifts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleNewEventClick = () => {
    navigate('/create-event');
  };

  useEffect(() => {
    const fetchData = async () => {
      const ownedEvents = await getUserOwnedEvents(currentUser.uid);
      setEvents(ownedEvents);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='h-full w-full p-16'>
      <div className='grid grid-cols-2 gap-x-8 gap-y-6'>
        <div className='col-span-2'>
          <CollapsibleCard
            open
            title='Your Events'
            btnText='New Event'
            onBtnClick={handleNewEventClick}>
            <table className='table'>
              {/* head */}
              <thead>
                <tr className='border-b-neutral'>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Date</th>
                  <th>Members</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0
                  ? events.map((event: any) => (
                      <tr
                        key={event.id}
                        className='border-b-neutral'>
                        <td>{event?.name}</td>
                        <td>{event?.ownerDisplayName}</td>
                        <td>{convertSecondsToLocalDate(event?.date.seconds)}</td>
                        <td>{event.members ? event.members.length : 1}</td>
                        <td>
                          <Link
                            className='btn btn-ghost btn-xs'
                            to={`/event/${event?.id}`}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </CollapsibleCard>
        </div>
        <div className='col-span-1'>
          <CollapsibleCard title='Your Invitations'>
            <div className='p-4'>
              <p className='text-base-content'>Coming soon!</p>
            </div>
          </CollapsibleCard>
        </div>
        <div className='col-span-1'>
          <div className='flex w-full items-center justify-center'>
            <Card>
              <div className='flex items-center justify-center'>
                <div className='stats stats-vertical lg:stats-horizontal'>
                  <div className='stat'>
                    <div className='stat-title'>Joined Events</div>
                    <div className='stat-value text-primary'>{events.length}</div>
                    <div className='stat-desc'>Since Joining</div>
                  </div>
                  <div className='stat'>
                    <div className='stat-title'>Claimed Gifts</div>
                    <div className='stat-value text-primary'>{claimedGifts.length}</div>
                    <div className='stat-desc'>To Date</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEvents;

import React, { useState } from 'react';
import fake_events from '@/data/fake_events.json';
import CollapsibleCard from '@/components/CollapsibleCard';
import Card from '@/components/Card';

const ProfileEvents = () => {
  const [invitations, setInvitations] = useState([]);
  const [events, setEvents] = useState([]);
  const [claimedGifts, setClaimedGifts] = useState([]);

  return (
    <div className='h-full w-full p-16'>
      <div className='grid grid-cols-2 gap-x-8 gap-y-6'>
        <div className='col-span-2'>
          <CollapsibleCard
            open
            title='Your Events'
            btnText='New Event'>
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
                {fake_events
                  ? fake_events.map((data, index) => (
                      <tr
                        key={index}
                        className='border-b-neutral'>
                        <td>{data?.name}</td>
                        <td>{data?.owner}</td>
                        <td>{data?.date}</td>
                        <td>{data?.members.length}</td>
                        <td>
                          <button className='btn btn-ghost btn-xs'>
                            details
                          </button>
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
              <p className='text-base-content'>No invitations (yet)</p>
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
                    <div className='stat-value text-accent'>
                      {events.length}
                    </div>
                    <div className='stat-desc'>Since Joining</div>
                  </div>
                  <div className='stat'>
                    <div className='stat-title'>Claimed Gifts</div>
                    <div className='stat-value text-accent'>
                      {claimedGifts.length}
                    </div>
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

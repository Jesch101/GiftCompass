import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateInvite } from '@/config/firebase';
import Loader from '@/components/Loader';

const JoinEvent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const inviteCode = queryParams.get('code');

  useEffect(() => {
    async function validateAndJoin() {
      validateInvite({ inviteCode: inviteCode })
        .then((res: any) => {
          navigate(`/event/${res.data.eventId}`, { state: { joined: true } });
        })
        .catch((err: Error) => {
          setError(err.message);
          setTimeout(() => {
            navigate('/');
          }, 8000);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    validateAndJoin();
  }, [inviteCode]);

  if (loading) {
    return <Loader />;
  } else if (error) {
    return <p>{error}</p>;
  } else {
    return <p>Welcome to the event!</p>;
  }
};

export default JoinEvent;

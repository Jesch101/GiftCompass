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
          navigate(`/event/${res.data.eventId}`);
        })
        .catch((err: Error) => {
          setError(err.message);
          setTimeout(() => {
            navigate('/');
          }, 4000);
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
    return <p>Uh oh! This join link isn't working it seems. Redirecting you to our home page...</p>;
  } else {
    return <p>Welcome to the event!</p>;
  }
};

export default JoinEvent;

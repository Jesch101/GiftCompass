import React from 'react';

interface EventProps {
  id: string;
}

const Event: React.FC<EventProps> = ({ id }) => {
  return <div>Event: {id} </div>;
};

export default Event;

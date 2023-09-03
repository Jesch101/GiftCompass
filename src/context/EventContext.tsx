import React, { createContext, useContext, useState, useEffect } from 'react';

interface EventData {
  name: string;
  description: string;
  giftCategories: string[];
  date: Date | null;
}

interface EventContextProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface EventProviderProps {
  children: React.ReactNode;
}

const EventContext = createContext<EventContextProps>({} as EventContextProps);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [step, setStep] = useState<number>(0);
  const [eventData, setEventData] = useState<EventData>({
    name: '',
    description: '',
    giftCategories: [],
    date: null,
  });

  let value = { eventData, setEventData, step, setStep };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

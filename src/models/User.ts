import Gift from './Gift';
import Event from './Event';

type signInType = 'google' | 'email';

type RequestedGifts = { [eventId: string]: Gift['id'][] };

type ClaimedGifts = { [eventId: string]: Gift['id'][] };

interface User {
  id: string;
  name: string;
  email: string;
  signInType: signInType;
  joinedEvents?: Event['id'][] | null;
  createdEvents?: Event['id'][] | null;
  requestedGifts?: RequestedGifts | null;
  claimedGifts?: ClaimedGifts | null;
}

export default User;

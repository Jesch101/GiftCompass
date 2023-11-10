import User from './User';
import Gift from './Gift';

interface Event {
  id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  gifts: Gift[];
  eventDate: Date;
  publishDate: Date;
  visibility: 'private' | 'private-pw' | 'private-link-only' | 'private-invite-only' | 'public';
}

export default Event;

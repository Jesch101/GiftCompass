import User from './User';
import Event from './Event';

interface Gift {
  id: string;
  owner: User['id'];
  event: Event['id'];
  name: string;
  description?: string;
  link?: string;
  price?: string;
  amount?: number;
  reservedBy: User['id'] | null;
  reservedAt: Date | null;
}

export default Gift;

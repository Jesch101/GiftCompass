interface Gift {
  id: string;
  anonymous: boolean;
  eventId: string;
  name: string;
  link?: string;
  price?: string;
  requestedByName: string | null;
  requestedById: string | null;
  claimedByName?: string | null;
  claimedById?: string | null;
  reservedAt: Date | null;
  giftCategory: string | null;
}

export default Gift;

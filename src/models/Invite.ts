interface Invite {
  eventId: string;
  createdBy: string;
  expirationDate: Date;
  singleUse: boolean;
  usedBy: string[];
}

export default Invite;

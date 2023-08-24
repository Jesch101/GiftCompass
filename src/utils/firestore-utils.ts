import { db } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import Event from '@/models/Event';
import Gift from '@/models/Gift';
import User from '@/models/User';

// Utility function to add a new user
export async function addUser(user: User) {
  const userRef = doc(db, 'users', user.id);
  return await setDoc(userRef, user);
}

export async function deleteUser(user: string) {
  const userRef = doc(db, 'users', user);
  return await deleteDoc(userRef);
}

// Utility function to get user by ID
export async function getUser(userId: User['id']) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return null;
  }
}

// Utility function to add a new event
export async function addEvent(event: Event) {
  const eventsCollectionRef = collection(db, 'events');
  return await addDoc(eventsCollectionRef, event);
}

// Utility function to get all events
export async function getAllEvents() {
  const eventsCollectionRef = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCollectionRef);

  const events = eventsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return events;
}

// Utility function to add a new gift to an event
export async function addGift(eventId: Event['id'], gift: Gift) {
  const eventRef = doc(db, 'events', eventId);
  const giftsCollectionRef = collection(eventRef, 'gifts');

  return await addDoc(giftsCollectionRef, gift);
}

// Utility function to update a gift
export async function updateGift(
  eventId: Event['id'],
  giftId: Gift['id'],
  updatedGift: any
) {
  const eventRef = doc(db, 'events', eventId);
  const giftRef = doc(eventRef, 'gifts', giftId);

  return await updateDoc(giftRef, updatedGift);
}

// Utility function to delete a gift
export async function deleteGift(eventId: Event['id'], giftId: Gift['id']) {
  const eventRef = doc(db, 'events', eventId);
  const giftRef = doc(eventRef, 'gifts', giftId);

  return await deleteDoc(giftRef);
}

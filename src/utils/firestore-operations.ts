import { db } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  arrayRemove,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import User from '@/models/User';
import Gift from '@/models/Gift';

// Utility function to add a new user
export async function addUser(user: User) {
  const userRef = doc(db, 'users', user.id);
  return await setDoc(userRef, user);
}

export async function deleteUser(user: string) {
  const userRef = doc(db, 'users', user);
  return await deleteDoc(userRef);
}

export async function getUser(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return null;
  }
}

export async function createEvent(eventInfo: Record<string, any>): Promise<string> {
  const newEventId = uuidv4();

  const eventDocRef = doc(collection(db, 'events'), newEventId);
  const completeEventInfo = {
    ...eventInfo,
    id: newEventId,
  };
  return setDoc(eventDocRef, completeEventInfo).then(() => {
    return newEventId; // Return the event ID once the document has been created successfully
  });
}

export async function getEvent(eventId: string): Promise<any> {
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    return eventSnap.data();
  } else {
    throw new Error('Event not found');
  }
}

export async function getEventGifts(eventId: string): Promise<any> {
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    // Fetch the gifts sub-collection if it exists
    const giftsRef = collection(eventRef, 'gifts');
    const giftsQuery = query(giftsRef);
    const giftsSnap = await getDocs(giftsQuery);

    let gifts: any[] = [];
    if (!giftsSnap.empty) {
      gifts = giftsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    return gifts;
  } else {
    throw new Error('Event not found');
  }
}

export async function addGiftToEvent(eventId: string, gift: Gift): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const giftsCollectionRef = collection(db, 'events', eventId, 'gifts');
      const giftDocsSnapshot = await getDocs(giftsCollectionRef);
      const giftDocRef = doc(giftsCollectionRef, gift.id);

      await setDoc(giftDocRef, {
        ...gift,
        id: gift.id,
        eventId: eventId,
      });

      // Update the user to append the new gift ID to their 'requestedGifts' array
      if (gift.requestedById) {
        const userDocRef = doc(db, 'users', gift.requestedById);
        await updateDoc(userDocRef, {
          requestedGifts: arrayUnion(gift.id),
        });
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export const deleteGift = (gift: Gift): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the gift exists in the event's sub-collection
      const giftDocRef = doc(db, 'events', gift.eventId, 'gifts', gift.id);
      const giftDocSnap = await getDoc(giftDocRef);

      if (!giftDocSnap.exists()) {
        reject(new Error('Gift not found'));
        return;
      }

      // Delete the gift from the event's sub-collection
      await deleteDoc(giftDocRef);

      // Remove the gift ID from the user's requestedGifts array
      if (gift.requestedById) {
        const userDocRef = doc(db, 'users', gift.requestedById);
        await updateDoc(userDocRef, {
          requestedGifts: arrayRemove(gift.id),
        });
      }

      resolve();
    } catch (error: any) {
      reject(new Error(`Error deleting gift: ${error.message}`));
    }
  });
};

export async function checkEventExists(eventId: string): Promise<boolean> {
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);

  return eventSnap.exists();
}

export const addOwnedEvent = async (userId: string, eventId: string): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  return await updateDoc(userDocRef, {
    ownedEvents: arrayUnion(eventId),
  });
};

export async function getUserOwnedEvents(userId: string): Promise<any[]> {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnapshot = await getDoc(userDocRef);

  if (!userDocSnapshot.exists()) {
    return [];
  }

  const userData = userDocSnapshot.data();
  const ownedEventIds: string[] = userData?.ownedEvents || [];

  const eventPromises = ownedEventIds.map(async (eventId) => {
    const eventDocRef = doc(db, 'events', eventId);
    const eventDocSnapshot = await getDoc(eventDocRef);

    if (eventDocSnapshot.exists()) {
      return eventDocSnapshot.data();
    }

    return null;
  });

  const events = await Promise.all(eventPromises);

  // Filter out null values if any event documents were missing
  return events.filter((event) => event !== null);
}

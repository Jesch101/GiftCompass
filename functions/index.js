/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require('firebase-functions/v2/https');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
admin.initializeApp();

exports.generateInviteLink = onCall(
  { cors: ['http://localhost:5173', 'https://localhost:5173'] },
  async (request) => {
    const db = admin.firestore();

    const { eventId, expirationDate, singleUse } = request.data;
    const uid = request.auth.uid;

    // Validate user is the owner of the event.
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists || eventDoc.data().ownerId !== uid) {
      throw new HttpsError(
        'unauthenticated',
        'User does not have permission to generate invite for this event.'
      );
    }

    const inviteCode = uuidv4();

    const inviteData = {
      eventId: eventId,
      code: inviteCode,
      expirationDate: expirationDate,
      singleUse: singleUse,
      used: false, // to keep track if the invite has been used (only matters if singleUse is true)
    };

    await db.collection('invites').doc(inviteCode).set(inviteData);

    return `http://localhost:5173/join?code=${inviteCode}`;
  }
);

exports.validateInvite = onCall(
  { cors: ['http://localhost:5173', 'https://localhost:5173'] },
  async (request) => {
    const db = admin.firestore();

    const uid = request.auth.uid;
    if (!uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to validate an invite.');
    }

    const { inviteCode } = request.data;

    if (!inviteCode || typeof inviteCode !== 'string') {
      throw new HttpsError('invalid-argument', 'Invalid invite code provided.');
    }

    // Validate invite exists.
    let inviteDoc;
    try {
      const inviteRef = db.collection('invites').doc(inviteCode);
      inviteDoc = await inviteRef.get();
      if (!inviteDoc.exists) {
        throw new HttpsError('not-found', 'The provided invite code does not exist.');
      }
    } catch (error) {
      console.error('Error fetching invite:', error);
      throw new HttpsError('internal', 'Error fetching invite.');
    }

    const eventId = inviteDoc.data().eventId;
    if (!eventId || typeof eventId !== 'string') {
      throw new HttpsError('invalid-argument', 'Invalid event ID retrieved from invite.');
    }

    // Validate user is not already a member of the event.
    let eventDoc;
    try {
      const eventRef = db.collection('events').doc(eventId);
      eventDoc = await eventRef.get();
      if (!eventDoc.exists) {
        throw new HttpsError('not-found', 'The referenced event does not exist.');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new HttpsError('internal', 'Error fetching event.');
    }

    // Validate user is not already a member of the event.
    const members = eventDoc.data().members || [];
    if (members.includes(uid)) {
      throw new HttpsError('already-exists', 'User has already joined the event.');
    }

    // Validate invite has not expired.
    try {
      const eventRef = db.collection('events').doc(eventId);
      const inviteRef = db.collection('invites').doc(inviteCode);
      const inviteData = await inviteRef.get();

      if (inviteData.data().expirationDate < Date.now()) {
        throw new HttpsError('expired', 'The invite has expired.');
      }

      // Validate invite has not been used. If singleUse is false, this will always be false.
      if (inviteData.data().used && inviteData.data().singleUse) {
        throw new HttpsError('already-exists', 'The invite has already been used.');
      }

      const updateUsed = async () => inviteRef.update({ used: true });
      const addMember = async () =>
        eventRef.update({
          members: admin.firestore.FieldValue.arrayUnion(uid),
        });
      const updateMemberJoinedList = async () => {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const joinedEvents = userDoc.data().joinedEvents || [];
        userRef.update({ joinedEvents: admin.firestore.FieldValue.arrayUnion(eventId) });
      };

      Promise.all(addMember(), updateUsed(), updateMemberJoinedList());
    } catch (error) {
      throw new HttpsError('internal', 'Failed to update event with new participant.');
    }

    return { status: 'success', message: 'Successfully joined the event!', eventId: eventId };
  }
);

exports.deleteEvent = onCall(
  { cors: ['http://localhost:5173', 'https://localhost:5173'] },
  async (request) => {
    const db = admin.firestore();

    const { eventId } = request.data;
    const uid = request.auth.uid;

    if (!uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to do this.');
    }

    let eventDocRef, eventDoc, eventData;
    try {
      // Get event data
      eventDocRef = db.collection('events').doc(eventId);
      eventDoc = await eventDocRef.get();

      if (!eventDoc.exists) {
        throw new HttpsError('not-fount', 'Event does not exist.');
      }

      eventData = eventDoc.data();
      const ownerId = eventData?.ownerId;

      if (ownerId !== uid) {
        throw new HttpsError('unauthenticated', 'User is not authenticated to do this action.');
      }
    } catch (error) {
      throw new HttpsError('internal', `Error retrieving event: ${error.message}`);
    }

    try {
      const giftCollectionRef = eventDocRef.collection('gifts');
      const giftsSnapshot = await giftCollectionRef.get();
      const deleteGiftsPromises = giftsSnapshot.docs.map((doc) => {
        return doc.ref.delete();
      });

      await Promise.all(deleteGiftsPromises);
    } catch (error) {
      throw new HttpsError('internal', `Error deleting gifts: ${error.message}`);
    }

    // Delete event document
    try {
      await eventDocRef.delete();
    } catch (error) {
      throw new HttpsError('internal', `Error deleting event: ${error.message}`);
    }

    // Reference to the event's members
    try {
      const members = eventData?.members || [];
      const userUpdatePromises = members.map((memberId) => {
        const userRef = db.collection('users').doc(memberId);
        return userRef.update({
          joinedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
          ownedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
          [`requestedGifts.${eventId}`]: admin.firestore.FieldValue.delete(),
          [`claimedGifts.${eventId}`]: admin.firestore.FieldValue.delete(),
        });
      });

      await Promise.all(userUpdatePromises);
    } catch (error) {
      throw new HttpsError('internal', `Error updating user documents: ${error.message}`);
    }

    return { status: 'success', message: 'Successfully deleted the event!' };
  }
);

exports.deleteClaimedGift = onCall(
  { cors: ['http://localhost:5173', 'https://localhost:5173'] },
  async (request) => {
    const db = admin.firestore();
    const uid = request.auth.uid;

    if (!uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to do this.');
    }

    const { eventId, giftId, claimedById } = request.data;
    let userRef, userDoc;

    try {
      userRef = db.collection('users').doc(claimedById);
      userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'User does not exist.');
      }
    } catch (error) {
      throw new HttpsError('internal', `Error retrieving user: ${error.message}`);
    }

    try {
      userRef.update({
        [`claimedGifts.${eventId}`]: admin.firestore.FieldValue.arrayRemove(giftId),
      });
    } catch (error) {
      throw new HttpsError('internal', `Error deleting gift: ${error.message}`);
    }

    return { status: 'success', message: 'Successfully deleted the gift!' };
  }
);

export const firebaseAuthError = (errorCode: any): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please use a different email.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed. Please contact support.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use a stronger password.';
    default:
      return 'An error occurred. Please try again later.';
  }
};

export const googleAuthError = (errorCode: any): string => {
  switch (errorCode) {
    case 'auth/cancelled-popup-request':
      return 'Popup closed. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Popup closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup blocked. Please enable popups and try again.';
    default:
      return 'Error signing in with Google. Please try again.';
  }
};

export const firebaseFunctionError = (errorCode: any): string => {
  switch (errorCode) {
    case 'unauthenticated':
      return 'You must be authenticated to perform this action.';
    case 'invalid-argument':
      return 'Invalid input. Please check the provided data.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'The resource you are trying to access already exists.';
    case 'expired':
      return 'The resource you are trying to access has expired.';
    case 'internal':
      return 'An internal error occurred. Please try again later.';
    default:
      return 'An unknown error occurred. Please try again.';
  }
};

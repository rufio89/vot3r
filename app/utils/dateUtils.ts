import { Timestamp } from 'firebase/firestore';

export const formatDateTime = (dateTime: Timestamp | null) => {
  if (!dateTime) return 'Not set';
  return dateTime.toDate().toLocaleString();
};

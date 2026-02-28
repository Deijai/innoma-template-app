import { getFirestore } from 'firebase/firestore';

import { app } from '../firebase/firebase';

export const db = getFirestore(app);

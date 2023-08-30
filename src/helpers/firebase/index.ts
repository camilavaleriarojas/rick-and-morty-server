import { config } from 'dotenv';
import admin from 'firebase-admin';

config();

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
    projectId: process.env.PROJECT_ID,
  }),
});

export default firebaseApp;

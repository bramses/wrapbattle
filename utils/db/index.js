import admin from 'firebase-admin';
// import serviceAccount from './serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    const serviceAcctMinusPrivateKey = JSON.parse(process.env.FIREBASE_S_A_KEY);
    serviceAcctMinusPrivateKey.private_key = process.env.FIREBASE_P_K;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAcctMinusPrivateKey),
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();
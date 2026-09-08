import 'dotenv/config';
import admin from 'firebase-admin';

console.log('--- FIREBASE CONNECTION TEST ---');

try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });

  console.log('⌛ Pinging Firebase Authentication service...');

  // Querying up to 1 user tests both network access and IAM auth permissions
  admin.auth().listUsers(1)
    .then((userRecords) => {
      console.log('✅ SUCCESS! Firebase Admin is connected.');
      console.log(`📊 Project currently has ${userRecords.users.length} registered user(s).`);
    })
    .catch((error) => {
      console.error('❌ FIREBASE ERROR:', error.message);
    });

} catch (err) {
  console.error('❌ INITIALIZATION ERROR:', err.message);
}
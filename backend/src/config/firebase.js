import admin from 'firebase-admin';

function getFormattedPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;

  // Strip accidental outer quotes and replace escaped newlines
  return key.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getFormattedPrivateKey(),
    }),
  });
}

export default admin;
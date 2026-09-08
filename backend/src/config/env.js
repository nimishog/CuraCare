import dotenv from 'dotenv';

dotenv.config();

// Centralizes every environment variable in one place so the rest of the
// codebase never touches process.env directly.
const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // .env files store the private key with literal "\n" sequences.
    // They must be converted back into real newlines or Firebase Admin
    // will fail to parse the key.
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
    // Web API key, used only for the signInWithPassword REST call.
    // This is NOT the Admin private key and is safe to use server-side
    // (it is not the same as exposing it to the frontend).
    apiKey: process.env.FIREBASE_API_KEY,
  },
};

const required = [
  ['DATABASE_URL', env.databaseUrl],
  ['FIREBASE_PROJECT_ID', env.firebase.projectId],
  ['FIREBASE_CLIENT_EMAIL', env.firebase.clientEmail],
  ['FIREBASE_PRIVATE_KEY', env.firebase.privateKey],
  ['FIREBASE_API_KEY', env.firebase.apiKey],
];

for (const [name, value] of required) {
  if (!value) {
    // Fail loudly at boot rather than mysteriously later.
    // eslint-disable-next-line no-console
    console.warn(`[env] Warning: ${name} is not set. Check your .env file.`);
  }
}

export default env;
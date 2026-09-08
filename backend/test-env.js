import 'dotenv/config';

console.log('--- ENV INTEGRITY CHECK ---');
console.log('Project ID Loaded:', !!process.env.FIREBASE_PROJECT_ID);
console.log('Client Email Loaded:', !!process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key Loaded:', !!process.env.FIREBASE_PRIVATE_KEY);

if (process.env.FIREBASE_PRIVATE_KEY) {
  const formattedKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const isValidHeader = formattedKey.includes('-----BEGIN PRIVATE KEY-----');
  const isValidFooter = formattedKey.includes('-----END PRIVATE KEY-----');
  
  console.log('Key Has Proper RSA Header:', isValidHeader);
  console.log('Key Has Proper RSA Footer:', isValidFooter);
  
  if (isValidHeader && isValidFooter) {
    console.log('✅ ENV Key formatting is valid!');
  } else {
    console.error('❌ ENV Key is missing standard RSA PEM boundaries.');
  }
}
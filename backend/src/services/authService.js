// const { admin } = require('../config/firebase');
// const { prisma } = require('../config/prisma');
// const env = require('../config/env');
// const { generateDoctorId, generatePatientId } = require('../utils/idGenerator');

// const INTERNAL_AUTH_DOMAIN = '@auth.ayudoot.local';

// // D_100001 -> D_100001@auth.ayudoot.local
// // This internal email is never shown to the user; it only exists so
// // Firebase (which is built around email/password) has something to key on.
// function toInternalEmail(loginId) {
//   return `${loginId}${INTERNAL_AUTH_DOMAIN}`;
// }

// // The Admin SDK cannot verify a password directly - that's a deliberate
// // Firebase design choice. So for LOGIN we call Firebase's own REST API
// // (Identity Toolkit) using the Web API key, exactly the way a client SDK
// // would, and let Firebase tell us if the password was correct.
// async function firebaseSignInWithPassword(email, password) {
//   const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.firebase.apiKey}`;

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password, returnSecureToken: true }),
//   });

//   if (!response.ok) {
//     // Wrong password, unknown user, disabled user, etc. Caller treats
//     // this as "invalid credentials" without inspecting the reason,
//     // so we never leak account existence.
//     return null;
//   }

//   return response.json(); // { idToken, localId, ... }
// }

// // ---------------------------------------------------------------------
// // Registration (test-account creation)
// // ---------------------------------------------------------------------

// async function registerDoctor({ fullName, email, password, specialization }) {
//   const D_ID = await generateDoctorId();
//   const internalEmail = toInternalEmail(D_ID);

//   const firebaseUser = await admin.auth().createUser({
//     email: internalEmail,
//     password,
//   });

//   try {
//     await prisma.user.create({
//       data: {
//         firebaseUid: firebaseUser.uid,
//         loginId: D_ID,
//         role: 'DOCTOR',
//         doctorProfile: {
//           create: { D_ID, fullName, email, specialization },
//         },
//       },
//     });
//   } catch (err) {
//     // Keep Firebase and Postgres in sync: if the DB write fails
//     // (e.g. duplicate email), don't leave an orphaned Firebase user.
//     await admin.auth().deleteUser(firebaseUser.uid).catch(() => {});
//     throw err;
//   }

//   return { D_ID };
// }

// async function registerPatient({ fullName, email, password, dateOfBirth }) {
//   const P_ID = await generatePatientId();
//   const internalEmail = toInternalEmail(P_ID);

//   const firebaseUser = await admin.auth().createUser({
//     email: internalEmail,
//     password,
//   });

//   try {
//     await prisma.user.create({
//       data: {
//         firebaseUid: firebaseUser.uid,
//         loginId: P_ID,
//         role: 'PATIENT',
//         patientProfile: {
//           create: { P_ID, fullName, email, dateOfBirth: new Date(dateOfBirth) },
//         },
//       },
//     });
//   } catch (err) {
//     await admin.auth().deleteUser(firebaseUser.uid).catch(() => {});
//     throw err;
//   }

//   return { P_ID };
// }

// // ---------------------------------------------------------------------
// // Login
// // ---------------------------------------------------------------------

// async function loginDoctor({ D_ID, password }) {
//   const user = await prisma.user.findUnique({
//     where: { loginId: D_ID },
//     include: { doctorProfile: true },
//   });

//   // Same failure path whether the ID doesn't exist, belongs to a
//   // patient, is inactive, or the password is wrong - callers get one
//   // generic "invalid credentials" result either way.
//   if (!user || user.role !== 'DOCTOR' || !user.isActive || !user.doctorProfile) {
//     return null;
//   }

//   const firebaseResult = await firebaseSignInWithPassword(
//     toInternalEmail(D_ID),
//     password,
//   );

//   if (!firebaseResult) {
//     return null;
//   }

//   return {
//     token: firebaseResult.idToken,
//     user: {
//       id: user.id,
//       D_ID: user.doctorProfile.D_ID,
//       role: user.role,
//       fullName: user.doctorProfile.fullName,
//     },
//   };
// }

// async function loginPatient({ P_ID, password }) {
//   const user = await prisma.user.findUnique({
//     where: { loginId: P_ID },
//     include: { patientProfile: true },
//   });

//   if (!user || user.role !== 'PATIENT' || !user.isActive || !user.patientProfile) {
//     return null;
//   }

//   const firebaseResult = await firebaseSignInWithPassword(
//     toInternalEmail(P_ID),
//     password,
//   );

//   if (!firebaseResult) {
//     return null;
//   }

//   return {
//     token: firebaseResult.idToken,
//     user: {
//       id: user.id,
//       P_ID: user.patientProfile.P_ID,
//       role: user.role,
//       fullName: user.patientProfile.fullName,
//     },
//   };
// }

// // ---------------------------------------------------------------------
// // Current user (GET /api/auth/me)
// // ---------------------------------------------------------------------

// async function getCurrentUser(userId, role) {
//   if (role === 'DOCTOR') {
//     const profile = await prisma.doctorProfile.findUnique({ where: { userId } });
//     if (!profile) return null;
//     return { id: userId, D_ID: profile.D_ID, role, fullName: profile.fullName };
//   }

//   if (role === 'PATIENT') {
//     const profile = await prisma.patientProfile.findUnique({ where: { userId } });
//     if (!profile) return null;
//     return { id: userId, P_ID: profile.P_ID, role, fullName: profile.fullName };
//   }

//   return null;
// }

// module.exports = {
//   registerDoctor,
//   registerPatient,
//   loginDoctor,
//   loginPatient,
//   getCurrentUser,
//   toInternalEmail,
// };


















const mockUsers = [];
const mockDoctors = [];
const mockPatients = [];

let doctorCounter = 100001;
let patientCounter = 100001;

async function registerDoctor({ fullName, email, password, specialization }) {
  const D_ID = `D_${doctorCounter++}`;
  const userId = `user-doc-${D_ID.split('_')[1]}`;
  const user = { id: userId, loginId: D_ID, role: 'DOCTOR', isActive: true, password };
  const profile = { D_ID, fullName, email, specialization, userId };

  mockUsers.push(user);
  mockDoctors.push(profile);

  return { D_ID };
}

async function registerPatient({ fullName, email, password, dateOfBirth }) {
  const P_ID = `P_${patientCounter++}`;
  const userId = `user-pat-${P_ID.split('_')[1]}`;
  const user = { id: userId, loginId: P_ID, role: 'PATIENT', isActive: true, password };
  const profile = { P_ID, fullName, email, dateOfBirth, userId };

  mockUsers.push(user);
  mockPatients.push(profile);

  return { P_ID };
}

async function loginDoctor({ D_ID, password }) {
  const user = mockUsers.find((u) => u.loginId === D_ID && u.role === 'DOCTOR');
  if (!user || user.password !== password) return null;

  const profile = mockDoctors.find((d) => d.D_ID === D_ID);

  return {
    token: `mock-doctor-token-${user.id}`,
    user: {
      id: user.id,
      D_ID: profile.D_ID,
      role: user.role,
      fullName: profile.fullName,
    },
  };
}

async function loginPatient({ P_ID, password }) {
  const user = mockUsers.find((u) => u.loginId === P_ID && u.role === 'PATIENT');
  if (!user || user.password !== password) return null;

  const profile = mockPatients.find((p) => p.P_ID === P_ID);

  return {
    token: `mock-patient-token-${user.id}`,
    user: {
      id: user.id,
      P_ID: profile.P_ID,
      role: user.role,
      fullName: profile.fullName,
    },
  };
}

async function getCurrentUser(userId, role) {
  if (role === 'DOCTOR') {
    const profile = mockDoctors.find((d) => d.userId === userId);
    if (!profile) return null;
    return { id: userId, D_ID: profile.D_ID, role, fullName: profile.fullName };
  }

  if (role === 'PATIENT') {
    const profile = mockPatients.find((p) => p.userId === userId);
    if (!profile) return null;
    return { id: userId, P_ID: profile.P_ID, role, fullName: profile.fullName };
  }

  return null;
}

export {
  mockUsers,
  registerDoctor,
  registerPatient,
  loginDoctor,
  loginPatient,
  getCurrentUser,
};
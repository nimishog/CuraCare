import { prisma } from '../config/prisma.js';

const START_NUMBER = 100001;

// Looks at the highest existing D_ID/P_ID and returns the next one.
// D_ID/P_ID are zero-free, monotonically increasing numbers under a
// fixed prefix (D_100001, D_100002, ...), so sorting the string
// descending also sorts the number descending, which keeps this simple.
//
// Note: for a hackathon MVP this is sufficient. Under real concurrent
// registrations you'd want a DB sequence/counter table or a retry loop
// inside a serializable transaction to fully rule out a race condition.
async function generateNextLoginId(profileModel, idField, prefix) {
  const last = await prisma[profileModel].findFirst({
    orderBy: { [idField]: 'desc' },
  });

  let nextNumber = START_NUMBER;

  if (last && last[idField]) {
    const [, numberPart] = last[idField].split('_');
    const lastNumber = parseInt(numberPart, 10);
    if (!Number.isNaN(lastNumber) && lastNumber >= START_NUMBER) {
      nextNumber = lastNumber + 1;
    }
  }

  return `${prefix}_${nextNumber}`;
}

async function generateDoctorId() {
  return generateNextLoginId('doctorProfile', 'D_ID', 'D');
}

async function generatePatientId() {
  return generateNextLoginId('patientProfile', 'P_ID', 'P');
}

module.exports = { generateDoctorId, generatePatientId };
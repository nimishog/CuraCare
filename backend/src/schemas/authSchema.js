import { z } from 'zod';

// ---- Reusable Password Validation ----
const passwordSchema = z
  .string({ required_error: 'password is required' })
  .min(8, 'password must be at least 8 characters')
  .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'password must contain at least one number');

// ---- Login ----

export const doctorLoginSchema = z.object({
  D_ID: z
    .string({ required_error: 'D_ID is required' })
    .regex(/^D_\d{6}$/, 'D_ID must match the format D_100001 (D_ followed by exactly 6 digits)'),
  password: passwordSchema,
});

export const patientLoginSchema = z.object({
  P_ID: z
    .string({ required_error: 'P_ID is required' })
    .regex(/^P_\d{6}$/, 'P_ID must match the format P_100001 (P_ followed by exactly 6 digits)'),
  password: passwordSchema,
});

// ---- Registration (test-account creation only) ----

export const doctorRegisterSchema = z.object({
  fullName: z.string({ required_error: 'fullName is required' }).min(1),
  email: z.string({ required_error: 'email is required' }).email('invalid email'),
  password: passwordSchema,
  specialization: z.string({ required_error: 'specialization is required' }).min(1),
});

export const patientRegisterSchema = z.object({
  fullName: z.string({ required_error: 'fullName is required' }).min(1),
  email: z.string({ required_error: 'email is required' }).email('invalid email'),
  password: passwordSchema,
  dateOfBirth: z
    .string({ required_error: 'dateOfBirth is required' })
    .date('dateOfBirth must be a valid date (YYYY-MM-DD)'),
});
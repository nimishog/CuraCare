import express from 'express';

import { validate } from '../middleware/validate.js';
import { firebaseAuthMiddleware } from '../middleware/authMiddleware.js'; // Updated to authMiddleware
import {
  doctorLoginSchema,
  patientLoginSchema,
  doctorRegisterSchema,
  patientRegisterSchema,
} from '../schemas/authSchema.js'; // Updated to authSchema (singular)
import authController from '../controllers/authController.js';

const router = express.Router();

// Registration
router.post('/doctor/register', validate(doctorRegisterSchema), authController.doctorRegister);
router.post('/patient/register', validate(patientRegisterSchema), authController.patientRegister);

// Login
router.post('/doctor/login', validate(doctorLoginSchema), authController.doctorLogin);
router.post('/patient/login', validate(patientLoginSchema), authController.patientLogin);

// Current user
router.get('/me', firebaseAuthMiddleware, authController.getMe);

// Logout
router.post('/logout', authController.logout);

export default router;
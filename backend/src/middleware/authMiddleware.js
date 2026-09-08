import admin from '../config/firebase.js';
import { prisma } from '../config/prisma.js';

/**
 * Protects routes that require an authenticated user.
 * Expects: Authorization: Bearer <Firebase ID Token>
 */
async function firebaseAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verify Authorization header exists and has the Bearer scheme
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or malformed Authorization header',
      });
    }

    const token = authHeader.slice('Bearer '.length).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Missing token',
      });
    }

    // 2. Verify token with Firebase Admin SDK
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // 3. Query PostgreSQL via Prisma using the verified Firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User profile not found or account inactive',
      });
    }

    // 4. Attach verified user context to request
    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      loginId: user.loginId,
      role: user.role, // Always source role from database, never token/frontend
    };

    next();
  } catch (err) {
    next(err);
  }
}

export { firebaseAuthMiddleware };
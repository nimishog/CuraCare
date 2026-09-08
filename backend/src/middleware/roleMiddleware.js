// Usage: authorizeRole('DOCTOR') or authorizeRole('DOCTOR', 'PATIENT')
// Must run AFTER firebaseAuthMiddleware, since it relies on req.user.role,
// which was read from PostgreSQL, not from the client.
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: you do not have access to this resource',
      });
    }

    next();
  };
}

export { authorizeRole };
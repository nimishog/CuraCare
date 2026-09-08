// Wraps any Zod schema into an Express middleware.
// On success, req.body is replaced with the parsed (typed/cleaned) data.
// On failure, responds 400 with field-level error messages.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
}

export { validate };

// Last-resort error handler. Controllers call next(err) on unexpected
// failures; this keeps error shape consistent and avoids leaking internals.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: status === 500 ? 'Something went wrong' : err.message || 'Request failed',
  });
}

export { errorHandler };
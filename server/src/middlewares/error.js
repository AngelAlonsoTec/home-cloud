const HttpError = require('../lib/http-error');

// Translates file system errors into HTTP responses
const fsErrors = {
  ENOENT: { statusCode: 404, message: 'File or directory does not exist' },
  EEXIST: { statusCode: 409, message: 'File or directory already exists' },
  ENOTDIR: { statusCode: 400, message: 'Not a directory' },
  EISDIR: { statusCode: 400, message: 'Is a directory' },
  EACCES: { statusCode: 403, message: 'Permission denied' },
  EPERM: { statusCode: 403, message: 'Permission denied' },
};

// Messages from other errors may contain absolute paths, so they are only
// shown when the error is ours or marked as safe to expose (e.g. bad JSON)
const toResponse = (err) => {
  if (err instanceof HttpError || err.expose) {
    return { statusCode: err.statusCode, message: err.message };
  }
  return fsErrors[err.code];
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
};

const errorHandler = (err, req, res, next) => {
  const known = toResponse(err);
  if (!known) {
    console.error(err);
  }
  const { statusCode, message } = known || {
    statusCode: 500,
    message: 'Internal server error',
  };

  if (res.headersSent) {
    return next(err);
  }
  res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };

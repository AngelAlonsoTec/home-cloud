const { isValidToken } = require('../lib/session');
const HttpError = require('../lib/http-error');

const SESSION_COOKIE = 'home_cloud_session';

const requireAuth = (req, res, next) => {
  if (!isValidToken(req.cookies[SESSION_COOKIE])) {
    return next(new HttpError(401, 'Not authenticated'));
  }
  next();
};

module.exports = { SESSION_COOKIE, requireAuth };

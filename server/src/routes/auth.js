const router = require('express').Router();
const rateLimit = require('express-rate-limit').default;
const session = require('../lib/session');
const HttpError = require('../lib/http-error');
const { SESSION_COOKIE, requireAuth } = require('../middlewares/auth');

// Slows down brute force attacks against the password
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  handler: (req, res, next) =>
    next(new HttpError(429, 'Too many attempts, try again later')),
});

const cookieOptions = (req) => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: req.secure,
});

router.post('/login', loginLimiter, (req, res) => {
  if (!session.isValidPassword(req.body?.password)) {
    throw new HttpError(401, 'Wrong password');
  }

  res.cookie(SESSION_COOKIE, session.createToken(), {
    ...cookieOptions(req),
    maxAge: session.maxAgeMs,
  });
  res.json({ success: true, message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions(req));
  res.json({ success: true, message: 'Logged out' });
});

router.get('/session', requireAuth, (req, res) => {
  res.json({ success: true, message: 'Authenticated' });
});

module.exports = router;

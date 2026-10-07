const crypto = require('crypto');
const { password, sessionSecret, sessionHours } = require('../config');

const sha256 = (value) => crypto.createHash('sha256').update(value).digest();

const sign = (value) =>
  crypto.createHmac('sha256', sessionSecret).update(value).digest('base64url');

const safeEqual = (a, b) => crypto.timingSafeEqual(sha256(a), sha256(b));

const maxAgeMs = sessionHours * 60 * 60 * 1000;

const isValidPassword = (candidate) =>
  typeof candidate === 'string' && safeEqual(candidate, password);

/** Stateless token: "<expiration>.<signature>". */
const createToken = () => {
  const expiresAt = String(Date.now() + maxAgeMs);
  return `${expiresAt}.${sign(expiresAt)}`;
};

const isValidToken = (token) => {
  if (typeof token !== 'string') {
    return false;
  }
  const [expiresAt, signature = ''] = token.split('.');

  return safeEqual(signature, sign(expiresAt)) && Number(expiresAt) > Date.now();
};

module.exports = { maxAgeMs, isValidPassword, createToken, isValidToken };

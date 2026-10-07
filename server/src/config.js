const path = require('path');
const crypto = require('crypto');

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable ${name}`);
    process.exit(1);
  }
  return value;
};

module.exports = {
  port: Number(process.env.PORT) || 5000,
  storage: path.resolve(required('HOME_CLOUD_STORAGE')),
  password: required('HOME_CLOUD_PASSWORD'),
  // Without a fixed secret, sessions are invalidated on every restart
  sessionSecret:
    process.env.HOME_CLOUD_SESSION_SECRET ||
    crypto.randomBytes(32).toString('hex'),
  sessionHours: Number(process.env.HOME_CLOUD_SESSION_HOURS) || 24 * 7,
  maxUploadMb: Number(process.env.HOME_CLOUD_MAX_UPLOAD_MB) || 4096,
};

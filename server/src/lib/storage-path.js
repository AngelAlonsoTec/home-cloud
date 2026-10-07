const path = require('path');
const { storage } = require('../config');
const HttpError = require('./http-error');

const isOutsideStorage = (relativePath) =>
  relativePath === '..' ||
  relativePath.startsWith(`..${path.sep}`) ||
  path.isAbsolute(relativePath);

/**
 * Resolves a client path ("photos/2020") inside the storage directory.
 * Rejects any path that would escape it ("../../etc/passwd").
 */
const resolvePath = (clientPath = '') => {
  const absolutePath = path.resolve(storage, `.${path.sep}${clientPath}`);
  const relativePath = path.relative(storage, absolutePath);

  if (isOutsideStorage(relativePath)) {
    throw new HttpError(400, 'Invalid path');
  }

  return {
    absolutePath,
    // Clients always use "/" as separator, regardless of the server OS
    relativePath: relativePath.split(path.sep).join('/'),
  };
};

/** A valid name is a single path segment: no separators, no "." or "..". */
const assertValidName = (name) => {
  const isValid =
    typeof name === 'string' &&
    name.trim() !== '' &&
    name !== '.' &&
    name !== '..' &&
    !/[/\\]/.test(name);

  if (!isValid) {
    throw new HttpError(400, `Invalid name: ${name}`);
  }
};

module.exports = { resolvePath, assertValidName };

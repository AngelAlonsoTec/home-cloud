const router = require('express').Router();
const fs = require('fs');
const os = require('os');
const path = require('path');
const fileUpload = require('express-fileupload');
const { maxUploadMb } = require('../config');
const HttpError = require('../lib/http-error');
const { resolvePath, assertValidName } = require('../lib/storage-path');

// Files are streamed to disk instead of being kept in memory
const parseFiles = fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  limits: { fileSize: maxUploadMb * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: JSON.stringify({
    success: false,
    message: `Files must be smaller than ${maxUploadMb} MB`,
  }),
});

const uploadedFiles = (req) => [req.files?.file ?? []].flat();

// COPYFILE_EXCL makes the copy fail instead of overwriting existing files
const saveFile = async (file, dirPath) => {
  try {
    await fs.promises.copyFile(
      file.tempFilePath,
      path.join(dirPath, file.name),
      fs.constants.COPYFILE_EXCL
    );
  } catch (err) {
    if (err.code === 'EEXIST') {
      throw new HttpError(409, `File ${file.name} already exists`);
    }
    throw err;
  }
};

const removeTempFiles = (files) =>
  Promise.all(
    files.map((file) => fs.promises.rm(file.tempFilePath, { force: true }))
  );

router.post('/', parseFiles, async (req, res) => {
  const files = uploadedFiles(req);

  try {
    if (files.length === 0) {
      throw new HttpError(400, 'No files were uploaded');
    }
    const dir = resolvePath(req.query.path);
    files.forEach((file) => assertValidName(file.name));

    for (const file of files) {
      await saveFile(file, dir.absolutePath);
    }

    res.json({ success: true, message: 'Files successfully uploaded' });
  } finally {
    await removeTempFiles(files);
  }
});

module.exports = router;

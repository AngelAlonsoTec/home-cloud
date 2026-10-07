const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { resolvePath, assertValidName } = require('../lib/storage-path');

router.post('/', async (req, res) => {
  const parent = resolvePath(req.query.path);
  const name = req.body?.name;
  assertValidName(name);

  await fs.promises.mkdir(path.join(parent.absolutePath, name));

  res.json({ success: true, message: 'Directory created' });
});

module.exports = router;

const router = require('express').Router();
const fs = require('fs');
const { resolvePath } = require('../lib/storage-path');

const byName = (a, b) => a.localeCompare(b);

router.get('/', async (req, res) => {
  const dir = resolvePath(req.query.path);
  const entries = await fs.promises.readdir(dir.absolutePath, {
    withFileTypes: true,
  });

  const content = {
    directories: entries.filter((e) => e.isDirectory()).map((e) => e.name),
    files: entries.filter((e) => !e.isDirectory()).map((e) => e.name),
  };
  content.directories.sort(byName);
  content.files.sort(byName);

  res.json({ success: true, path: dir.relativePath, content });
});

module.exports = router;

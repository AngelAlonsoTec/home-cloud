const router = require('express').Router();
const path = require('path');
const { resolvePath } = require('../lib/storage-path');

router.get('/', (req, res, next) => {
  const file = resolvePath(req.query.path);
  const fileName = path.basename(file.absolutePath);

  // res.download sets Content-Type and Content-Disposition by itself
  res.download(file.absolutePath, fileName, { dotfiles: 'allow' }, (err) => {
    if (err) {
      next(err);
    }
  });
});

module.exports = router;

const express = require('express');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middlewares/auth');
const { notFound, errorHandler } = require('./middlewares/error');
const authRouter = require('./routes/auth');
const contentRouter = require('./routes/content');
const dirRouter = require('./routes/dir');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');

const app = express();

// Trust the reverse proxy (nginx) on private networks, so req.secure works
app.set('trust proxy', 'loopback, uniquelocal');

app.use(express.json());
app.use(cookieParser());

const api = express.Router();
api.use('/auth', authRouter);
api.use(requireAuth);
api.use('/content', contentRouter);
api.use('/dir', dirRouter);
api.use('/upload', uploadRouter);
api.use('/download', downloadRouter);

app.use('/api', api);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

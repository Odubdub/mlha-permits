const express = require('express');
const accessControlRouter = express.Router();

const authenticationRouter = require('./routes/auth');

accessControlRouter.use('/auth', authenticationRouter);

module.exports = accessControlRouter;


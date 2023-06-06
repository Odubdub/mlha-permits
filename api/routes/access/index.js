const express = require('express');
const accessControlRouter = express.Router();

const authenticationRouter = require('./routes/auth');
const customerAuthRouter = require('./routes/auth-customer');

accessControlRouter.use('/auth', authenticationRouter);
accessControlRouter.use('/auth-customer', customerAuthRouter);

module.exports = accessControlRouter;


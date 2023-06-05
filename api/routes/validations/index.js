const express = require('express');
const validationsRouter = express.Router();

const { cipaRouter } = require('./routes/cipa.route');
const omangRouter = require('./routes/omang.route');

validationsRouter.use('/cipa', cipaRouter);
validationsRouter.use('/omang', omangRouter);

module.exports = validationsRouter;
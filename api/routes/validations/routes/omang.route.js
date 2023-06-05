const express = require('express');
const fethOmangFromEID = require('../../../helpers/e-id-info.helper');
const omangRouter = express.Router();

omangRouter.route('/:omangNumber')
  .get(async (req, res, next) => {
    try {
      const eidResponse = await fethOmangFromEID(req.params.omangNumber);

      if (eidResponse.status == 'error') {
        res.status(404).json({
          message: 'Omang not found'
        });
      } else {
        res.status(200).json(eidResponse);
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = omangRouter;
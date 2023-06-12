const lodash = require('lodash');
const mongoose = require('mongoose');
const User = require('../models/access/User');
const Applicant = require('../models/applicants/applicant.model');

function paginatedResults(model) {
  return async (req, res, next) => {
    // filter
    const type = req.query.type;
    const status = req.query.status;
    const order = req.query.order;

    // pagination stuff
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const endIndex = page * limit;
    const startIndex = (page - 1) * limit;

    const responsePayload = {};
    const numDocuments = await model.countDocuments({ type: type }).exec();

    if (startIndex > 0) {
      responsePayload.previous = {
        limit: limit,
        page: page - 1
      };
    }

    if (endIndex < numDocuments) {
      responsePayload.next = {
        limit: limit,
        page: page + 1
      };
    }

    if (limit < numDocuments) {
      responsePayload.pages = Math.ceil(numDocuments / limit);
    }

    let filter = {};

    //Type of service
    if (type != 'all') {
      filter = { serviceCode: type };
    }

    //Status of application
    if (status != 'all') {
      filter = {
        ...filter,
        status
      };
    }

    //Sort by
    let sort = { [req.query.sort]: order };

    //If search
    if (![undefined, '', 'null'].includes(req.query.query)) {
      const query = req.query.query;
      const applicants = await Applicant.find({ $text: { $search: query } });

      //Filter by query
      filter = {
        ...filter,
        $or: [
          { applicationAuthor: { $in: applicants.map((app) => app._id) } },
          { applicationOwner: { $in: applicants.map((app) => app._id) } }
        ]
      };
    }

    const user = await User.findById(req.decoded._id)
      .populate({
        path: 'roles',
        model: 'Role',
        select: ['name', 'service'],
        populate: {
          path: 'service',
          model: 'Service',
          select: ['name', 'code']
        }
      })
      .exec();

    if (user && user.type == 'admin' && user.roles.length > 0) {
      const serviceCodes = lodash.uniq(user.roles.map((role) => role.service.code));

      if (type == 'all') {
        filter = {
          ...filter,
          serviceCode: {
            $in: serviceCodes
          }
        };
      }
    } else if (user && user.type == 'superadmin' && user.department) {
      filter = {
        ...filter,
        department: mongoose.Types.ObjectId(user.department)
      };
    } else if (user && user.type == 'developer') {
      filter = {
        ...filter
      };
    } else {
      return res.status(401).json({
        message: 'You are not authorized to access this resource'
      });
    }

    filter = {
      serviceCode: req.query.filters.split(',')
    };

    try {
      const numberOfDocs = await model.countDocuments(filter).exec();

      const numberOfPages = Math.ceil(numberOfDocs / limit);
      console.log('pages: ', numberOfPages);

      responsePayload.results = await model
        .find(filter, {
          _id: 1,
          status: 1,
          type: 1,
          reviewStatus: 1,
          createdAt: 1,
          department: 1,
          name: 1,
          updatedAt: 1,
          applicationOwner: 1
        })
        .populate('applicationOwner')
        .limit(limit)
        .skip(startIndex)
        .sort(sort)
        .exec();

      responsePayload.pages = numberOfPages;
      res.paginatedResults = responsePayload;
      // create a variable in res to send results to caller

      next();
    } catch (e) {
      throw e;
    }
  };
}

module.exports = paginatedResults;

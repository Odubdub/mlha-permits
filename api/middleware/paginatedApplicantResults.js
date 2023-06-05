const lodash = require('lodash');
const mongoose = require('mongoose');
const User = require("../models/access/User");
const Applicant = require('../models/applicants/applicant.model');

function paginatedApplicantResults(model) {
  return async (req, res, next) => {
    // filter
    const sort = req.query.sort;
    const type = req.query.type;

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
      }
    }
  
    if (endIndex < numDocuments) {
      responsePayload.next = {
        limit: limit,
        page: page + 1
      }
    }

    if (limit < numDocuments) {
      responsePayload.pages = Math.ceil(numDocuments / limit)
    }

    let filter;

    if (type == 'all') {
      filter = {};
    } else {
      filter = { type };
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

    const author = await Applicant.findOne({idNo: req.params.userId})
    console.log(author)
    
    if (!author){
        res.paginatedResults = {
            "results": [
            ]
        }; // create a variable in res to send results to caller
        next();
    } else {
        
        if (user &&  user.type == 'admin' && user.roles.length > 0) {
            const serviceCodes = lodash.uniq(user.roles.map(role => role.service.code));
      
            filter = {
              ...filter,
              serviceCode: {
                $in: serviceCodes
              }
            };
          } else if (user && user.type == 'superadmin' && user.department) {
            filter = {
              ...filter,
              department: mongoose.Types.ObjectId(user.department)
            }
          }

          filter = {
            ...filter,
            applicationOwner: author._id
          }


      
          try {
      
            responsePayload.results = await model
              .find(filter, { _id: 1, status: 1, type: 1, createdAt: 1, department: 1, name: 1, updatedAt: 1, applicationOwner: 1})
              .limit(limit)
              .skip(startIndex)
              .sort({updatedAt: -1})
              .populate('applicationOwner').exec();
            res.paginatedResults = responsePayload; // create a variable in res to send results to caller
            next();
          } catch (e) {
            throw e;
          }
    }
  }
}

module.exports = paginatedApplicantResults;
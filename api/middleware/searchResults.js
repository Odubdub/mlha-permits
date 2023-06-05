const lodash = require('lodash');
const mongoose = require('mongoose');
const User = require("../models/access/User");
const Applicant = require('../models/applicants/applicant.model');
const Application = require('../models/application/application.model')

const searchApplications = async (req, res, next) => {
    const type = req.query.type;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const status = req.query.status;
    const sort = req.query.sort;

    // console.log('query ', query)
    console.log('type ', type)
    console.log('limit ', limit)
    console.log('page ', page)
    console.log('status ', status)
    console.log('sort ', sort)

    const query = req.query.query;
    const applicants = await Applicant.find({ $text: { $search: query } });

    //Filter by query
    let filter = {
      $or: [
          { applicationAuthor: { $in: applicants.map(app => app._id) } },
          { applicationOwner: { $in: applicants.map(app => app._id) } },
      ]
    }
    console.log(query)
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


    //Filter by admin context
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
    } else if (user && user.type == 'developer') {
        filter = {
            ...filter
        }
    } else {
        return res.status(401).json({
            message: 'You are not authorized to access this resource'
        });
    }

    // Filter by statuses
    if (status && status != 'all') {
        filter = {
            ...filter,
            status
        }
    }
    try {
        const applications = await Application
        .find(filter, { _id: 1, status: 1, type: 1, createdAt: 1, department: 1, name: 1, updatedAt: 1, applicationOwner: 1})
        .populate('applicationOwner')             
        .exec();
        res.paginatedResults = applications
        next()
    } catch (error) {
        throw e;          
    };
}

module.exports = searchApplications;

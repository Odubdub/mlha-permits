const express = require('express');
const router = express.Router();

const rolesRouter = require('./routes/roles.route');
const servicesRouter = require('./routes/services.route');
const ministriesRouter = require('./routes/ministries.route');
const adminUsersRouter = require('./routes/admin-users.route');
const departmentsRouter = require('./routes/departments.route');
const servicesConfigRouter = require('./routes/services-config.route');
const {notificationsRouter} = require('./routes/notifications.route');

router.use('/roles', rolesRouter);
router.use('/services', servicesRouter);
router.use('/ministries', ministriesRouter);
router.use('/admin-users', adminUsersRouter);
router.use('/departments', departmentsRouter);
router.use('/services-config', servicesConfigRouter);
router.use('/notifications', notificationsRouter);

module.exports = router;
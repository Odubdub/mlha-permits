const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const registerServices = require('./registry');

// routes
const indexRouter = require('./routes/index');
const authorityRouter = require('./routes/authority');
const accessControlRouter = require('./routes/access');
const validationsRouter = require('./routes/validations');
const certificateRouter = require('./routes/certificate');
const applicationRouter = require('./routes/application');
const paymentsRouter = require('./routes/payments');
const statisticsRouter = require('./routes/statistics');
const migrationRouter = require('./routes/migrate');
const {queriesRouter} = require('./routes/queries');
const filesRouter = require('./routes/files');
const logsRouter = require('./routes/logs/logs')

// load env variables
dotenv.config();

/**
 * @description: utility methods to make the app more readable
 */

const connectDB = require('./util/db');
const configurePassport = require('./util/passport');
const initialiseServices = require('./util/services');

// connect to database
connectDB();

// initialize services
// initialiseServices();

const globalErrorHandler = require('./middleware/global-error-handler');
const config = require('./config/config');
const formdataRouter = require('./routes/formdata');
const validateIssuanceRouter = require('./routes/validate_issuance');
const { audit } = require('./helpers/audit-logs.helper');

//register services
registerServices();

// create express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// allow all origins
app.use(cors({
  origin: '*'
}));

app.use(logger('dev', {
  skip: (req, res) => audit(req, res) }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}));

/**
 * @description: Do passport configuration
 */
 app.use(passport.initialize()); // initialize passport
 configurePassport(passport); // configure passport
 app.use(passport.session()); // enable passport sessions

app.use('/', indexRouter);
app.use('/authority', authorityRouter);
app.use('/certificate', certificateRouter);
app.use('/validations', validationsRouter);
app.use('/applications', applicationRouter);
app.use('/payments', paymentsRouter);
app.use('/access-control', accessControlRouter);
app.use('/statistics', statisticsRouter);
app.use('/files', filesRouter);
app.use('/migrate', migrationRouter);
app.use('/queries', queriesRouter);
app.use('/formdata', formdataRouter);
app.use('/validate', validateIssuanceRouter);
app.use('/logs', logsRouter);

/**
 * @description: Global Error handler
 */
app.use(globalErrorHandler);

module.exports = app;
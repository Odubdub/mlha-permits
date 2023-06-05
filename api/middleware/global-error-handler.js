// a middleware function that handles errors globally
const globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.message);

  if (typeof (err) === 'string') {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === 'ValidationError') {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: err.message });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}

module.exports = globalErrorHandler;
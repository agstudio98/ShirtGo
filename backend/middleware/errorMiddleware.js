/**
 * @fileoverview Global Error Handling Middleware.
 * Clean Code: Centralizes error response logic, providing detailed info in dev
 * and sanitised messages in production.
 */

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development: Leak full stack trace and error details for debugging
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: Sanitize responses for the end user
    
    // Operational, trusted error: send structured message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown error: log detail and send generic message
      console.error('[Error] CRITICAL FAILURE:', err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error: Something went wrong.',
      });
    }
  }
};

export default errorMiddleware;

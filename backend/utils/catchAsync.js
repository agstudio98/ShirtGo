/**
 * @fileoverview Higher-order function to eliminate boilerplate try-catch blocks.
 * Clean Code Principle: Keeps controllers clean and focused on business logic.
 * 
 * @param {Function} fn - Asynchronous controller function.
 * @returns {Function} - Express middleware function that catches rejected promises.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // Express controllers receive 3 arguments. If next is missing, something is wrong with the route.
    const errorHandler = typeof next === 'function' ? next : (err) => {
      console.error('[CRITICAL ERROR] next is not a function in catchAsync!', err);
      if (!res.headersSent) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error (Middleware Flow)' });
      }
    };

    Promise.resolve(fn(req, res, errorHandler)).catch(errorHandler);
  };
};

export default catchAsync;

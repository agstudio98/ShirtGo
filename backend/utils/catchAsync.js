/**
 * @fileoverview Higher-order function to eliminate boilerplate try-catch blocks.
 * Clean Code Principle: Keeps controllers clean and focused on business logic.
 * 
 * @param {Function} fn - Asynchronous controller function.
 * @returns {Function} - Express middleware function that catches rejected promises.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // Create a local fail-safe next function
    const safeNext = (err) => {
      if (typeof next === 'function') {
        return next(err);
      }
      console.error('[FATAL] next is not a function. Sending direct error response.');
      if (!res.headersSent) {
        res.status(500).json({
          status: 'error',
          message: err?.message || 'Internal Server Error',
          details: 'Middleware sequence failure'
        });
      }
    };

    Promise.resolve(fn(req, res, safeNext)).catch(safeNext);
  };
};

export default catchAsync;

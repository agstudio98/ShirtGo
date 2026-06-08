/**
 * @fileoverview Higher-order function to eliminate boilerplate try-catch blocks.
 * Clean Code Principle: Keeps controllers clean and focused on business logic.
 * 
 * @param {Function} fn - Asynchronous controller function.
 * @returns {Function} - Express middleware function that catches rejected promises.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // Determine if we have a valid next function from Express
    const hasNext = typeof next === 'function';

    const safeNext = (err) => {
      // If no error, and we have next, just call it to continue the chain
      if (!err && hasNext) return next();

      // Log the error for backend diagnostics
      console.error('[BACKEND ERROR]', err?.message || err);

      // If we have next, delegate to the global error handler
      if (hasNext) {
        return next(err);
      }

      // EMERGENCY: If next is missing, we MUST send a response to avoid hanging the client
      if (!res.headersSent) {
        res.status(err?.statusCode || 500).json({
          status: 'error',
          message: err?.message || 'Internal Server Error',
          details: 'Recovered from middleware failure'
        });
      }
    };

    // Execute the controller. We pass safeNext as the THIRD argument.
    // This ensures that even if Express fails to provide 'next', our controller gets safeNext.
    Promise.resolve(fn(req, res, safeNext)).catch(safeNext);
  };
};

export default catchAsync;

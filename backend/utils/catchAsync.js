/**
 * @fileoverview Higher-order function to eliminate boilerplate try-catch blocks.
 * Clean Code Principle: Keeps controllers clean and focused on business logic.
 * 
 * @param {Function} fn - Asynchronous controller function.
 * @returns {Function} - Express middleware function that catches rejected promises.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // Ensure next is a function before calling the controller
    if (typeof next !== 'function') {
      console.error('[CRITICAL] catchAsync: next is not a function. Check route definition.');
      return;
    }
    
    // Execute the async function and catch any errors
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export default catchAsync;

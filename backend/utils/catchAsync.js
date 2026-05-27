/**
 * @fileoverview Higher-order function to eliminate boilerplate try-catch blocks.
 * Clean Code Principle: Keeps controllers clean and focused on business logic.
 * 
 * @param {Function} fn - Asynchronous controller function.
 * @returns {Function} - Express middleware function that catches rejected promises.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // If the promise rejects, the error is passed to the global error handler (next)
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;

/**
 * @fileoverview Custom Error class for operational errors.
 * Clean Code: Extends the built-in Error class to provide structured
 * HTTP-related context.
 */

class AppError extends Error {
  /**
   * Create an operational error.
   * @param {string} message - Descriptive error message.
   * @param {number} statusCode - HTTP status code (e.g., 404, 500).
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Status is 'fail' for 4xx errors and 'error' for 5xx errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    /**
     * isOperational: Boolean flag to distinguish between trusted operational errors
     * (e.g., validation) and unexpected programming errors (e.g., undefined variables).
     */
    this.isOperational = true;

    // Capture the stack trace without including this constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

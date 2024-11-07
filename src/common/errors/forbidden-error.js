// src/common/errors/forbidden-error.js
const CustomError = require('./custom-error');

module.exports = class ForbiddenError extends CustomError {
    constructor(message = 'Access denied') {
        super(message);
        this.statusCode = 403; 
    }

    /**
     * پیاده‌سازی متد generateErrors
     * @returns {Array<{message: string}>}
     */
    generateErrors() {
        return [{ message: this.message }];
    }
};

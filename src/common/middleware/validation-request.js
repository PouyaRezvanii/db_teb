const { validationResult } = require('express-validator');
const RequsetValidationError = require('../errors/request-validation-error');

module.exports = (req, res, next) => {
    // validation 
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return next(new RequsetValidationError(errors.array()))
    }

    next();
} 
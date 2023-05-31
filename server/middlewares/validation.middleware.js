const { body } = require('express-validator');

class ValidationMiddleware {
    getAccessTokenFromReq(req) {
        const token = req.headers.authorization;
        if (!token) throw new (ApiError.BadRequest());
        const accessToken = token.split(' ')[1];
        if (!accessToken) throw new (ApiError.BadRequest());

        return accessToken;
    }

    validateRegistrationData() {
        return [
            body('mail').isEmail()
                .withMessage('Please provide a valid email address.'),
            body('password').isLength({ min: 7, max: 16 })
                .withMessage('Password must be between 7 and 16 characters long.'),
            body('name').isLength({ min: 4 })
                .withMessage('Name must be at least 4 characters long.'),
        ];
    }
}

module.exports = new ValidationMiddleware();

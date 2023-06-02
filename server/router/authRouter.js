const { Router } = require('express');
const userController = require('../controllers/userControllers')
const router = Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const workerController = require('../mobile-api/controller/worker.controller');


router.post('/registration',
    body('mail').isEmail(),
    body('password').isLength({ min: 8, max: 32 }),
    userController.registration)
    .post('/login', userController.login)
    .post('/logout', userController.logout)
    .get('/users', authMiddleware, userController.getUsers)
    .post('/refresh', userController.refresh)
    .post('/registrateworker', validationMiddleware.validateRegistrationData(), workerController.registrateWorker)
    .get('/', authMiddleware, userController.getUser)
    .patch('/changeUserData',
        body('mail').isEmail(),
        body('password').isLength({ min: 8, max: 32 }),
        userController.changeUserData);

module.exports = router;

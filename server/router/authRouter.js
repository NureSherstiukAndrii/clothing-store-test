const { Router } = require('express');
const userController = require('../controllers/userControllers')
const router = Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registration',
    body('mail').isEmail(),
    body('password').isLength({min:8, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/users', userController.getUsers)
router.post('/refresh', authMiddleware, userController.refresh)

module.exports = router;

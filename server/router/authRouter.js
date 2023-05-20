const { Router } = require('express');

const userController = require('../controllers/userControllers')
const router = Router();

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/users', userController.getUsers)
router.post('/refresh', userController.refresh)

module.exports = router;

const Router = require('express').Router;
const authMiddleware = require("../../middlewares/authMiddleware");
const WorkerController = require('../controller/worker.controller')
const validationMiddleware = require('../../middlewares/validation.middleware');

const router = new Router;

router
    .post('/', validationMiddleware.validateRegistrationData(), WorkerController.registrateWorker)
    .patch('/', authMiddleware, WorkerController.changeWorker);
// .get('/orders', authMiddleware, WorkerController.getOrders)

module.exports = router;
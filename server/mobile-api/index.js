const { Router } = require("express");
const workerRouter = require('./router/worker.router')
const orderRouter = require('./router/orders.router')

const router = new Router();

router
    .use('/worker', workerRouter)
    .use('/orders', orderRouter);

module.exports = router;
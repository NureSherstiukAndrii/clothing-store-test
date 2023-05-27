const { Router } = require("express");
const workerRouter = require('./router/worker.router')

const router = new Router();

router
    .use('/worker', workerRouter)

module.exports = router;
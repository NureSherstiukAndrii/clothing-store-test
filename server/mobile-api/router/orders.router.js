const { Router } = require("express");
const ordersController = require("../controller/orders.controller");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = new Router();

router
    .get('/available', authMiddleware, ordersController.getOrders)
    .patch('/:id', authMiddleware, ordersController.changeOrderStatus)
    .delete('/:id', authMiddleware, ordersController.deleteOrder)

module.exports = router;
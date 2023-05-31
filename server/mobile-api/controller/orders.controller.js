const ApiErrors = require("../../exeptions/apiErrors");
const ordersService = require("../service/orders.service");


class OrdersController {
    async getOrders(req, res, next) {
        try {
            if (req.user.role != 'W')
                return next(ApiErrors.UnauthorizedError());
            const orders = await ordersService.getOrders();
            return res.json(orders);
        } catch (e) {
            next(e)
        }
    }
    async changeOrderStatus(req, res, next) {
        try {
            if (req.user.role != 'W')
                return next(ApiErrors.UnauthorizedError());

            const id = req.params.id;
            const status = req.body.status;

            const result = await ordersService.changeOrderStatus(id, status);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async deleteOrder(req, res, next) {
        try {
            if (req.user.role != 'W')
                return next(ApiErrors.UnauthorizedError());
            const id = req.params.id;
            await ordersService.deleteOrder(id);
            return res.json({ message: `Заказ номер ${id} успешно удален!` });
        } catch (e) {
            next(e)
        }
    }
    async getOrder(req, res, next) {
        try {
            // if (req.user.role != 'W')
            //     return next(ApiErrors.UnauthorizedError());

            const id = req.params.id;
            const orderData = await ordersService.getOrder(id);
            return res.json(orderData)
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrdersController();
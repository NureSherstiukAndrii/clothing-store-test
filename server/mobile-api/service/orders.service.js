const ApiErrors = require('../../exeptions/apiErrors');
const utilities = require('../utilities/')

class OrdersService {
    async getOrders(id) {
        const sql = await utilities.getConnection();

        const andExpression = id ? `AND O.num = ${id}` : '';

        const result = await sql.query(`
        SELECT
            U.Name as 'Customer name',
            O.num AS OrderNumber,
            COUNT(OI.id) AS OrderedItemCount,
            O.total_price AS OrderPrice
        FROM
            Orders O
            INNER JOIN Users U ON O.u_id = U.Id
            INNER JOIN Ordered_items OI ON O.num = OI.order_num
        WHERE
            O.status = 'Не оброблен' ${andExpression}
        GROUP BY
            O.num,
            U.Name,
            O.total_price
        `);
        return result.recordset;
    }

    async getOrder(id) {
        const sql = await utilities.getConnection();
        const orderData = await this.getOrders(id);

        // console.log(id)

        const orderItemsData = await sql.query(`
            SELECT oi.p_id AS product_id, p.Name AS product_name, COUNT(oi.p_id) AS quantity,
                p.price AS unit_price, SUM(p.price) AS total_price
            FROM Ordered_items AS oi
            JOIN Products AS p ON oi.p_id = p.Id
            WHERE oi.order_num = ${id}
            GROUP BY oi.p_id, p.Name, p.price;
        `);

        return {
            order: orderData,
            orderItems: orderItemsData.recordsets[0]
        };
    }

    async changeOrderStatus(id, status) {
        const sql = await utilities.getConnection();
        await sql.query(`
            UPDATE Orders
            SET status = '${status}'
            WHERE num = ${id};
        `);

        const result = await sql.query(`SELECT * FROM Orders WHERE num = ${id}`);
        return result.recordset;
    }
    async deleteOrder(id) {
        const sql = await utilities.getConnection();
        const order = await sql.query(`SELECT * FROM Orders WHERE num = ${id}`);
        if (order.recordset.length == 0)
            throw ApiErrors.BadRequest('Не существует заказа с таким номером!');
        else await sql.query(`DELETE FROM Orders WHERE num = ${id}`);
    }
}

module.exports = new OrdersService();
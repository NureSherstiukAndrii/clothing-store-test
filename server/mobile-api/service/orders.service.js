const ApiErrors = require('../../exeptions/apiErrors');
const utilities = require('../utilities/')

class OrdersService {
    async getOrders() {
        const sql = await utilities.getConnection();
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
            O.status = 'Не оброблен'
        GROUP BY
            O.num,
            U.Name,
            O.total_price
        `);
        return result.recordset;
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
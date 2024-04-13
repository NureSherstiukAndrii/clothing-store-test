const sql = require('mssql');
let instance = null;
require('dotenv').config();
const config = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    server: process.env.SERVER_DB,
    database: process.env.DATABASE_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
};

console.log(config);

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async checkInFav(user_id, product_id) {
        try {
            await sql.connect(config);
            const result = await sql.query`SELECT * FROM Cart_Fav WHERE u_id = ${user_id} AND p_id = ${product_id} AND is_cart=0`;
            return result.recordset;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async getAllProductsFromCart(id) {
        try {
            await sql.connect(config);
            const result = await sql.query`SELECT Products.Id, Name, price, size FROM Products INNER JOIN Cart_Fav ON Products.id = Cart_Fav.p_id WHERE u_id = ${id} AND is_cart = 1`;
            const total_price = await sql.query`SELECT SUM(Products.price) AS total_price
                                                FROM Cart_Fav
                                                JOIN Products ON Cart_Fav.p_id = Products.id
                                                WHERE Cart_Fav.u_id = ${id} AND is_cart = 1`;
            return {
                products: result.recordset,
                total_price: total_price.recordset[0].total_price
            };
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async countProducts(){
        try {
            await sql.connect(config);
            const result = await sql.query`SELECT COUNT(Id) as pdCount FROM Products;`;
            return result.recordset[0].pdCount;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async getAllProducts() {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query("SELECT * FROM Products").then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsWithOffset(page){
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT * FROM Products ORDER BY Id 
                                            OFFSET ${(page-1) * 25} ROWS FETCH NEXT 25 ROWS ONLY`).then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getProductForNameAndSize(name, size) {
        try {
            await sql.connect(config);
            const result = await sql.query`SELECT Id FROM Products WHERE Name=${name} AND size=${size}`;
            return result.recordset[0].Id
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async getProduct(id) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT * FROM Products WHERE id = ${id}`).then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getProductForName(product_name) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT Distinct size FROM Products WHERE Name = '${product_name}'`).then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }




    async addProduct(name, sex, price, description, type_of_product,size, season, amount, images) {
        try {
            await sql.connect(config);
            const result = await sql.query`EXEC InsertProduct ${sex}, ${name} , ${price}, ${description}, ${type_of_product}, ${size} , ${season}, ${amount}, ${images}`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async editProduct(productId, name, sex, price, description, type_of_product,size, season, amount, images) {
        try {
            await sql.connect(config);
            const result = await sql.query`EXEC UpdateProduct ${productId}, ${sex}, ${name} , ${price}, ${description}, ${type_of_product}, ${size} , ${season}, ${amount}, ${images}`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }


    async deleteProduct(productId) {
        try {
            await sql.connect(config);
            const result = await sql.query`EXEC DeleteProduct ${productId}`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async getProductImages(){
        try {
            const pool = new sql.ConnectionPool(config);
            return await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query("SELECT * FROM Product_img;").then((result, err) => {
                        if (err) {
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    async getUser(id) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT * FROM Users WHERE id = ${id}`).then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getRecentClothes(){
        try {
            const pool = new sql.ConnectionPool(config);
            return await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY Name ORDER BY date_added DESC) AS RowNum
    FROM Products
) AS subquery
WHERE RowNum = 1
ORDER BY date_added DESC
OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY;`).then((result, err) => {
                        if (err) {
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
    async getTopClothes(){
        try {
            const pool = new sql.ConnectionPool(config);
            return await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY rating ORDER BY date_added DESC) AS RowNum
    FROM Products
) AS subquery
WHERE RowNum = 1
ORDER BY rating DESC
OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY;
`).then((result, err) => {
                        if (err) {
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    async addIntoCart_Fav(userId, productId, is_cart) {
        try {
            await sql.connect(config);
            const result = await sql.query`INSERT INTO Cart_Fav (u_id, p_id, is_cart) VALUES (${userId}, ${productId}, ${is_cart})`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async deleteFromCart_Fav(u_id, p_id, is_cart){
        try {
            await sql.connect(config);
            const result = await sql.query`DELETE FROM Cart_Fav WHERE u_id = ${u_id} AND p_id = ${p_id} AND is_cart=${is_cart}`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }


    async getAllProductsFromFavorite(id) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT Products.Id, Name, price, size FROM Products INNER JOIN Cart_Fav ON Products.id = Cart_Fav.p_id WHERE u_id = ${id} AND is_cart = 0`).then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsWithFilters(trueGender, trueSize, trueTypes, trueSeasons, priceFrom, priceTo,sortingValue) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);

                    let query = `SELECT * FROM Products WHERE 1=1`;

                    if (trueGender) {
                        const genders = trueGender.split(',').map(g => `'${g}'`).join(', ');
                        query += ` AND (gender IN (${genders}))`;
                    }

                    if (trueSize) {
                        const sizes = trueSize.split(',').map(g => `'${g}'`).join(', ');
                        query += ` AND (size IN (${sizes}))`;
                    }

                    if (trueTypes) {
                        const types = trueTypes.split(',').map(g => `'${g}'`).join(', ');
                        query += ` AND (type_of_product IN (${types}))`;
                    }

                    if (trueSeasons) {
                        const seasons = trueSeasons.split(',').map(g => `'${g}'`).join(', ');
                        query += ` AND (season IN (${seasons}))`;
                    }

                    if (priceTo !== '' || priceFrom !== '') {
                        priceFrom === '' ? priceFrom  = 0 : priceFrom;
                        priceTo === '' ? priceTo = 1000000 : priceTo;
                        query += ` AND (price BETWEEN ${priceFrom} AND ${priceTo})`;
                    }

                    if (sortingValue !== ''){
                        if (sortingValue === 'fromLowPrice') {
                            sortingValue = 'price'
                        }
                        if (sortingValue === 'fromHighPrice') {
                            sortingValue = 'price DESC'
                        }
                        if (sortingValue === 'date_added') {
                            sortingValue = 'date_added DESC'
                        }
                        if (sortingValue === 'rating') {
                            sortingValue = 'rating DESC'
                        }
                        query += ` ORDER BY ${sortingValue}`;
                    }

                    request.query(query).then((result, err) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.recordset);
                        pool.close();
                    }).catch((err) => {
                        console.error(err);
                        pool.close();
                    });
                })
            })
            return response
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;



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

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // async getFilesFromStorage() {
    //     try {
    //         const [files] = await bucket.getFiles();
    //         console.log('files', files);
    //         return files;
    //     } catch (err) {
    //         console.error('ERROR:', err);
    //     }
    // }
    async getAllProductsFromCart(id) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT Products.Id, Name, price FROM Products INNER JOIN Cart_Fav ON Products.id = Cart_Fav.p_id WHERE u_id = ${id} AND is_cart = 1;`).then((result, err) => {
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




    async addProduct(name, sex, price, description, type_of_product,type,size,rating, season,collection_name, images) {
        try {
            await sql.connect(config);
            const result = await sql.query`EXEC InsertProduct ${sex}, ${name} , ${price}, ${description}, ${type_of_product},${type}, ${size} ,${rating}, ${season},${collection_name}, ${images}`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }

    async deleteTour(id){
        sql.connect(config)
            .then(pool => {
                const request = pool.request();
                request.query(`DELETE FROM MyTable WHERE id = ${id}`)
                    .then(result => {
                        console.log(`Deleted ${result.rowsAffected} rows`);
                    })
                    .catch(error => {
                        console.log(`Error: ${error}`);
                    });
            })
            .catch(error => {
                console.log(`Error connecting to the database: ${error}`);
            });
    }

    async editTour(id, name) {
        try {
            await sql.connect(config);
            const result = await sql.query`UPDATE MyTable SET Name=${name} WHERE Id=${id}`;
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
                    request.query(`SELECT TOP 4 * FROM Products ORDER BY date_added DESC;`).then((result, err) => {
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
                    request.query("SELECT TOP 4 * FROM Products ORDER BY rating DESC;").then((result, err) => {
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

    async deleteFromCart_Fav(u_id, p_id){
        try {
            await sql.connect(config);
            const result = await sql.query`DELETE FROM Cart_Fav WHERE u_id = ${u_id} AND p_id = ${p_id}`;
        } catch (error) {
            console.log(error);
        } finally {
            sql.close();
        }
    }


    async getAllProductsFromFav(id) {
        try {
            const pool = new sql.ConnectionPool(config);
            const response = await new Promise((resolve, reject) => {
                pool.connect().then(() => {
                    const request = new sql.Request(pool);
                    request.query(`SELECT * FROM Cart_Fav WHERE u_id = ${id} AND is_cart = 0`).then((result, err) => {
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



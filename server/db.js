const sql = require('mssql');
let instance = null;

const config = {
    user: "dsrdsr7",
    password: "NAMS9kUgcwgQS@S",
    server: "dsrdsr7v2.database.windows.net",
    database: "Internet_ cloth_shop_v2",
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






}

module.exports = DbService;



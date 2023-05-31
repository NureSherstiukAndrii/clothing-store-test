const sql = require('mssql');
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

const getConnection = async () => {
    await sql.connect(config);
    return sql;
};

module.exports = {
    getConnection
};
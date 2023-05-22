const jwt = require('jsonwebtoken');
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

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, 'jwt-access-secret', {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, 'jwt-refresh-secret', {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, 'jwt-access-secret')
            return userData
        }
        catch (e){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, 'jwt-refresh-secret')
            return userData
        }
        catch (e){
            return null;
        }
    }

    async saveToken(userId, refreshToken){
        await sql.connect(config);
        const tokenData = await sql.query`SELECT token FROM Users WHERE id = ${userId}`
        if(tokenData){
            await sql.query`UPDATE Users SET token = ${refreshToken} WHERE id = ${userId}`
        }

        // const token = await sql.query`UPDATE Users SET token = ${refreshToken} WHERE id = ${userId}`
        return tokenData;
    }

    async removeToken(refreshToken){
        await sql.connect(config);
        const tokenData = await sql.query`UPDATE Users SET token = ${refreshToken} WHERE token = ${refreshToken}`;
    }




    async findToken(refreshToken){
        await sql.connect(config);
        const tokenData = await sql.query`SELECT token FROM Users WHERE token = ${refreshToken}`;

        tokenData.then(async (result) => {
            if (result.recordset.length > 0) {
                return result;
            } else {
                return null;
            }
        }).catch((error) => {
            console.log('token error', error);
        });
    }
}


module.exports = new TokenService();
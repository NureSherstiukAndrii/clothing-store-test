const sql = require('mssql');
const bcrypt = require('bcrypt');
const tokenService = require('../service/tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exeptions/apiErrors')
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

class UserService {
    async registration(name, mail, password){
        await sql.connect(config);
        const candidate = sql.query`SELECT * FROM Users WHERE e_mail = ${mail} AND password = ${password}`

        candidate.then(async (result) => {
            if (result.recordset.length > 0) {
                throw ApiError.BadRequest(`Пользователь с почтовым адресом ${mail} уже существует`);
            } else {
                const hashPassword = await bcrypt.hash(password, 3)
                const user = await sql.query`INSERT INTO Users ([Name], e_mail, [password]) VALUES ('${name}', '${mail}', '${hashPassword}');`
                const userDto = new UserDto(user.recordset)
                console.log('userDto', userDto);
                const tokens = tokenService.generateTokens({...userDto})
                await tokenService.saveToken(user.recordset[0].id, tokens.refreshToken)

                return{...tokens, user: userDto }
            }
        }).catch((error) => {
            console.log('candidate error', error);
        });
    }

    async login(mail, password){
        await sql.connect(config);
        const user = sql.query`SELECT * FROM Users WHERE e_mail = ${mail} AND password = ${password}`

        user.then(async (result) => {
        if (result.recordset.length > 0) {
            throw ApiError.BadRequest(`Пользователь с ${mail} не найден`);
        } else {
            const isPassEquals = await bcrypt.compare(password, result.recordset[0].password)
            if(!isPassEquals){
                throw ApiError.BadRequest(`Неверный пароль`);
            }
            const userDto = new UserDto(user.recordset)
            const tokens = tokenService.generateTokens({...userDto})
            await tokenService.saveToken(user.recordset[0].id, tokens.refreshToken)

            return{...tokens, user: userDto }
        }
    }).catch((error) => {
    console.log('candidate error', error);
        });
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await sql.query`SELECT * FROM Users WHERE id = ${userData.id}`
        const userDto = new UserDto(user.recordset)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(user.recordset[0].id, tokens.refreshToken)

        return{...tokens, user: userDto }

    }

    async getAllUsers(){
        await sql.connect(config);
        const users = await sql.query`SELECT * FROM Users`
        users.then(async result =>{
            return result.recordset;
        })
    }
}


module.exports = new UserService();
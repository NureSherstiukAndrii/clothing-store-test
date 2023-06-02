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
    async registration(name, mail, password, role) {
        const hashPassword = await bcrypt.hash(password, 3);
        await sql.connect(config);

        const candidate = await sql.query`SELECT * FROM Users WHERE e_mail = ${mail} AND password = ${password}`;
        if (candidate.recordset.length > 0) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${mail} уже существует`);
        }
        const query = role ? `INSERT INTO Users (Name, e_mail, password, role) VALUES ('${name}', '${mail}', '${hashPassword}', '${role}')`
            : `INSERT INTO Users (Name, e_mail, password) VALUES ('${name}', '${mail}', '${hashPassword}')`;

        // console.log("query : ", query)
        const user = await sql.query(query);

        const newUser = await sql.query`SELECT * FROM Users WHERE e_mail = ${mail}`;

        const userDto = new UserDto(newUser.recordset[0]);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async login(mail, password) {

        await sql.connect(config);
        const user = await sql.query`SELECT * FROM Users WHERE e_mail = ${mail}`



        if (user.recordset.length === 0) {
            throw ApiError.BadRequest(`Пользователь с ${mail} не найден`);
        }

        const isPassEquals = await bcrypt.compare(password, user.recordset[0].password)
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Неверный пароль`);
        }
        const userDto = new UserDto(user.recordset[0])
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        await sql.connect(config);
        const user = await sql.query`SELECT * FROM Users WHERE id = ${userData.id}`
        const userDto = new UserDto(user.recordset[0])
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(user.recordset[0].id, tokens.refreshToken)

        return { ...tokens, user: userDto }

    }

    async getAllUsers() {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async changeUserInfo(name, email, userId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request().query(`UPDATE Users SET Name = '${name}' , e_mail = '${email}' WHERE Id = ${userId}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}


module.exports = new UserService();
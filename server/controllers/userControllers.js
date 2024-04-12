const userService = require('../service/userService');
const { validationResult } = require('express-validator');
const ApiError = require('../exeptions/apiErrors')
const sql = require("mssql");

class UserControllers {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { name, mail, password } = req.body;
            console.log(name, mail, password);
            const userData = await userService.registration(name, mail, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { mail, password } = req.body;
            const userData = await userService.login(mail, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (e) {
            next(e);
        }
    }


    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');

            return res.json(token)
        }
        catch (e) {
            next(e);
        }
    }


    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users)
        }
        catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            return res.json(req.user)
        } catch (e) {
            next(e)
        }
    }


    async changeUserData(req, res, next) {
        try {
            const {name, email, userId} = req.body;
            const updateUser = await userService.changeUserInfo(name, email, userId);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserControllers();
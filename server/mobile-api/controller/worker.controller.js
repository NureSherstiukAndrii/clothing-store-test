const { validationResult } = require('express-validator');
// const workerService = require('../service/worker.service');
const userService = require('../../service/userService');
const ApiErrors = require('../../exeptions/apiErrors');


class WorkerController {
    async registrateWorker(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { name, mail, password } = req.body;
            const workerData = await userService.registration(name, mail, password, 'W')
            res.cookie('refreshToken', workerData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(workerData)
        } catch (e) {
            next(e);
        }
    }

    async changeWorker(req, res, next) {

    }
}

module.exports = new WorkerController();
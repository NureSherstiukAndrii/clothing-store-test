const { validationResult } = require('express-validator');
// const workerService = require('../service/worker.service');
const userService = require('../../service/userService');


class WorkerController {
    async registrateWorker(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { name, mail, password } = req.body;
            const workerData = await userService.registration(name, mail, password, 'W')
            return res.json(workerData)
        } catch (e) {
            next(e);
        }
    }

    async changeWorker(req, res, next) {

    }
}

module.exports = new WorkerController();
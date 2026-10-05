const authService = require("../services/authService");

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        const result = await authService.login(email, password);

        res.set("Cache-Control", "no-store");
        return res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return next(error);
    }
};
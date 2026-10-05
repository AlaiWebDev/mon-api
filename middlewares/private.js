const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    const authorization = req.get("Authorization") || "";

    const match = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({
            message: "Authentification requise"
        });
    }

    const token = match[1];
    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"]
        });
    } catch (error) {
        return res.status(401).json({
            message: "Jeton invalide ou expiré"
        });
    }

    if (
        typeof payload !== "object" ||
        !mongoose.isObjectIdOrHexString(payload.sub)
    ) {
        return res.status(401).json({
            message: "Jeton invalide"
        });
    }

    try {
        const user = await User.findById(payload.sub);

        if (!user) {
            return res.status(401).json({
                message: "Utilisateur introuvable"
            });
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
};
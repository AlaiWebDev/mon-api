const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.login = async (email, password) => {
    if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
    ) {
        const error = new Error("Email et mot de passe requis");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({
        email: email.trim().toLowerCase()
    }).select("+password");

    const passwordIsValid =
        user &&
        user.password &&
        await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        const error = new Error("Email ou mot de passe incorrect");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {},
        process.env.JWT_SECRET,
        {
            subject: user._id.toString(),
            algorithm: "HS256",
            expiresIn: "1h"
        }
    );

    return { token };
};
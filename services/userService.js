const User = require('../models/userModel');
const bcrypt = require("bcryptjs");

exports.getAllUsers = () => {
  return User.find();
};

exports.getUserById = (id) => {
  return User.findById(id);
};
exports.getUserByEmail = (mail) => {
  return User.findOne({email:mail});
};

exports.createUser = async (data = {}) => {
    const { nom, email, password, age } = data;

    if (
        typeof nom !== "string" ||
        !nom.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        password.length < 12 ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        const error = new Error(
            "Nom, email et mot de passe de 12 caractères minimum requis " +
            "(72 octets maximum pour le mot de passe)"
        );
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        const error = new Error("Un utilisateur avec cet email existe déjà");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        return await User.create({
            nom: nom.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            age
        });
    } catch (error) {
        if (error.code === 11000) {
            error.statusCode = 409;
            error.message = "Un utilisateur avec cet email existe déjà";
        }
        throw error;
    }
};

exports.updateUser = (id, data) => {
    return User.findByIdAndUpdate(
        id,
        { $set: getEditableFields(data) },
        { new: true, runValidators: true }
    );
};

exports.patchUser = (id, data) => {
    return User.findByIdAndUpdate(
        id,
        { $set: getEditableFields(data) },
        { new: true, runValidators: true }
    );
};

exports.deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

function getEditableFields(data = {}) {
    const fields = {};

    for (const field of ["nom", "email", "age"]) {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            fields[field] = data[field];
        }
    }

    return fields;
}

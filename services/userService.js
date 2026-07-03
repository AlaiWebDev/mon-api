const User = require('../models/userModel');

exports.getAllUsers = () => {
  return User.find();
};

exports.getUserById = (id) => {
  return User.findById(id);
};
exports.getUserByEmail = (mail) => {
  return User.findOne({email:mail});
};

exports.createUser = (data) => {
  const existingUser = User.findOne({ email: data.email });

  if (existingUser) {
    const error = new Error("Un utilisateur avec cet email existe déjà");
    error.statusCode = 409;
    throw error;
  }
  const user = new User(data);
  return user.save();
};

exports.updateUser = (id, data) => {
  if ('createdAt' in data) {
    delete data.createdAt;
  }
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.patchUser = (id, data) => {
  if ('createdAt' in data) {
    delete data.createdAt;
  }
  return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
};

exports.deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

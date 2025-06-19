const User = require('../models/userModel');

exports.getAllUsers = () => {
  return User.find();
};

exports.getUserById = (id) => {
  return User.findById(id);
};

exports.createUser = (data) => {
  const user = new User(data);
  return user.save();
};

exports.updateUser = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

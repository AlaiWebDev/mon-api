const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
};

exports.getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
};

exports.createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user)
        return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
};

exports.deleteUser = async (req, res) => {
    console.log("ID reçu :", req.params.id);
    const user = await userService.deleteUser(req.params.id);
    if (!user)
        return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(204).send();
};

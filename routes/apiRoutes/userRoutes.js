const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get('/:id', userController.getUserById);
// Route pour pre-login
router.get("/email/:email", userController.getUserByEmail);
router.put('/:id', userController.updateUser);
router.patch('/:id', userController.patchUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

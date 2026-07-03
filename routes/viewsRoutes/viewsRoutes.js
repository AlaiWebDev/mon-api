const express = require("express");
const router = express.Router();

const userService = require("../../services/userService");
const userController = require("../../controllers/userController");

// Page d'accueil
router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.render("index", { users });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

// Page formulaire édition
router.get("/users/:id/edit", userController.renderEditForm);

module.exports = router;
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const userService = require('../services/userService');
const userController = require('../controllers/userController');
// Page d'accueil EJS
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.render('index', { users });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});
// Formulaire d'édition
router.get('/:id/edit', userController.renderEditForm);

router.use('/api/users', userRoutes);

module.exports = router;
# Procédure de base pour initier une API avec une BDD NoSQL MongoDB

```bash
npm init -y
npm install express
npm install mongoose
```

exemple-api/  
├── controllers/  
│   └── userController.js  
├── models/  
│   └── userModel.js  
├── services/  
│   └── userService.js  
├── routes/  
│   └── userRoutes.js  
├── app.js  
├── package.json  

## Créer le serveur Express (app.js) et se connecter à la BDD

```js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/mon-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.error('Erreur MongoDB :', err));

// Middlewares
app.use(express.json()); // Middleware pour lire le JSON
app.use('/api/users', userRoutes);

// Middleware d'erreur simple (optionnel mais recommandé)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));
```

## Créer un modèle (Ex. models/userModel.js)

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

## Définir les routes (Ex : routes/userRoutes.js)

```js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
```

## Créer les contrôleurs (Ex : controllers/userController.js)

```js
const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
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
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
  res.status(204).send();
};
```

## services/userService.js

Le service gère la logique métier (base de données).  

```js
const userService = require('../services/userService');

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

```

## Tester ton API

Avec Postman ou Insomnia, fais des requêtes :

- GET http://localhost:3000/api/users

- POST http://localhost:3000/api/users
  body de la requête en JSON :

  ```json
  {
    "nom": "Toto",
    "email": "toto@example.com",
    "age": 20
  }
  ```

- GET http://localhost:3000/api/users/{ID}

- PUT http://localhost:3000/api/users/{ID}
  Body de la requête en JSON :

  ```json
  {
  "age": 35
  }
  ```

- DELETE http://localhost:3000/api/users/{ID}
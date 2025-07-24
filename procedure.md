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
├── views/ - **Si partie FrontEnd**  
│   └── index.js  
├── app.js  
├── package.json  

## Créer le serveur Express (app.js) et se connecter à la BDD

```js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/mon-api', {
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

// Si FrontEnd, exploitation du dossier public pour les fichiers statiques (css, images, etc)
app.use(express.static('public'));

// Page d'accueil EJS
app.get('/', async (req, res) => {
  try {
    const users = await userModel.find(); // ou find() si Mongo
    res.render('index', { users });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
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
  createdAt: {
    type: Date,
    immutable: true, // 🔒 jamais modifiable
    default: () => Date.now()
  }
}, 
  {timestamps: true} // ➜ ajoute automatiquement createdAt et updatedAt}
);

module.exports = mongoose.model('User', userSchema);
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

exports.patchUser = async (req, res) => {
    const user = await userService.patchUser(req.params.id, req.body);
    try {
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
  res.status(204).send();
};
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
router.patch('/:id', userController.patchUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
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

```

## Tester ton API

Avec Postman ou Insomnia, fais des requêtes :

- GET http://localhost:3000/api/users

- POST http://localhost:3000/api/users
  
  Headers :  
  Content-Type: application/json  
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

  Headers :  
  Content-Type: application/json  
  Body de la requête en JSON :

  ```json
  {
    "nom": "Toto Cotugno",
    "email": "toto2@example.com",
    "age": 35
  }
  ```

- PATCH http://localhost:3000/api/users/{ID}

  Headers :  
  Content-Type: application/json  
  Body de la requête en JSON :

  ```json
  {
  "age": 35
  }
  ```

- DELETE http://localhost:3000/api/users/{ID}

## Intégrer un FrontEnd

Intégrer une partie FrontEnd avec le moteur de template ejs  

```bash
npm install --save-dev nodemon
```

Template du fichier index.ejs du dosier /views :  

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Liste des utilisateurs</title>
  <link rel="stylesheet" href="/assets/css/index.css">
</head>
<body>
  <h1>Liste des utilisateurs</h1>
  <table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>Email</th>
        <th>Âge</th>
      </tr>
    </thead>
    <tbody>
      <% users.forEach(user => { %>
        <tr>
          <td><%= user.nom %></td>
          <td><%= user.email %></td>
          <td><%= user.age %></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
</body>
</html>
```

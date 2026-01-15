# Procédure de base pour initier une API avec une BDD NoSQL MongoDB

```bash
npm init -y
npm install express
npm install mongoose
```

exemple-api/  
├── public/ - **Si partie FrontEnd**  
│       └── assets/css/index.css  
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
const app = express();
const indexRouter = require("./routes/indexRoutes");
const userRoutes = require('./routes/userRoutes');
// Déclaration du moteur de template et du dossier des views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/exemple-api', { //ou mongodb+srv://alainwebdev:<db_password>@essai.mnphttb.mongodb.net/?appName=essai
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.error('Erreur MongoDB :', err));

// Middlewares
app.use(express.json()); // Middleware pour lire le JSON


// Middleware d'erreur simple (optionnel mais recommandé)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Exploitation du dossier public pour les fichiers statiques (css, images, etc)
app.use(express.static('public'));

// Routes 
app.use("/", indexRouter);
app.use("/users", indexRouter);   // pour les vues frontend

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));
```

## Créer un modèle (Ex. models/userModel.js)

```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number }
}, 
  {timestamps: true} // ➜ ajoute automatiquement createdAt et updatedAt}
);

module.exports = mongoose.model('User', userSchema);
```

## Créer les contrôleurs (Ex : controllers/userController.js)

```js
const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "Aucun utilisateur trouvé"
            });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
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
    try {
        const user = await userService.patchUser(req.params.id, req.body);
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

// Afficher le formulaire pré-rempli
exports.renderEditForm = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.render('editUser', { user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

exports.patchUser = async (req, res) => {
    try {
        const user = await userService.patchUser(req.params.id, req.body);
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

```

## Définir les routes globales API + Front (Ex : routes/indexRoutes.js)

```js
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
```

## Définir les routes pour le modèle  USER (Ex : routes/userRoutes.js)

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

Template du fichier index.ejs du dossier /views :  

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

Template du fichier index.ejs du dossier /views :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Modifier l'utilisateur</title>
</head>
<body>
  <h1>Modifier l'utilisateur</h1>
  <form id="editForm">
    <label>Nom :
      <input type="text" name="nom" value="<%= user.nom %>">
    </label>
    <br>
    <label>Email :
      <input type="email" name="email" value="<%= user.email %>">
    </label>
    <br>
    <label>Âge :
      <input type="number" name="age" value="<%= user.age %>">
    </label>
    <br>
    <button type="submit">Enregistrer</button>
  </form>
  <script>
    const form = document.getElementById('editForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        nom: form.nom.value,
        email: form.email.value,
        age: form.age.value
      };

      const response = await fetch('/api/users/<%= user.id %>', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
      window.location.href = '/'; // route qui rend index.ejs
    }
    });
  </script>
</body>
</html>
```

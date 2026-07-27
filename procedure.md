# Procédure de base pour initier une API avec une BDD NoSQL MongoDB

```bash
npm init -y
npm install express
npm install mongoose
npm install nodemon
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
│   └── index.ejs  
├── app.js  
├── package.json  

## Tester ton API

Avec Postman ou Insomnia, fais des requêtes :

- GET http://localhost:2000/api/users

- POST http://localhost:2000/api/users
  
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

- GET http://localhost:2000/api/users/{ID}

- PUT http://localhost:2000/api/users/{ID}

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

- PATCH http://localhost:2000/api/users/{ID}

  Headers :  
  Content-Type: application/json  
  Body de la requête en JSON :

  ```json
  {
  "age": 35
  }
  ```

- DELETE http://localhost:2000/api/users/{ID}

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
          <td><a href="/users/<%= user.id %>/edit"><button>Modifier</button></a></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
</body>
</html>
```

Template du fichier editUser.ejs du dossier /views :

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

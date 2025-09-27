const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const indexRouter = require("./routes/indexRoutes");
const userRoutes = require('./routes/userRoutes');
// Déclaration du motreur de template et du dossier des views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/mon-api', {
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

app.use("/", indexRouter);
app.use("/users", indexRouter);   // pour les vues frontend

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));
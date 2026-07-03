const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const viewsRouter = require("./routes/viewsRoutes/viewsRoutes");
const apiRouter = require("./routes/apiRoutes/indexRoutes");
// Déclaration du motreur de template et du dossier des views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connexion à MongoDB
mongoose
    .connect("mongodb://localhost:27017/exemple-api", {
        //ou mongodb+srv://alainwebdev:<db_password>@essai.mnphttb.mongodb.net/?appName=essai
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connecté à MongoDB"))
    .catch((err) => console.error("Erreur MongoDB :", err));

// Routes globales
app.use("/", viewsRouter);      // Front-end / vues EJS
app.use("/api", apiRouter);     // API REST

// Middleware d'erreur simple (optionnel mais recommandé)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur serveur" });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));

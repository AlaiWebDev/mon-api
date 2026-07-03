const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
// const reservationRoutes = require("./reservationRoutes");
// const catwayRoutes = require("./catwayRoutes");

// Toutes les routes liées aux utilisateurs commenceront par /api/users
router.use("/users", userRoutes);

// Toutes les routes liées aux réservations commenceront par /api/reservations
// router.use("/reservations", reservationRoutes);

// Toutes les routes liées aux catways commenceront par /api/catways
// router.use("/catways", catwayRoutes);

module.exports = router;
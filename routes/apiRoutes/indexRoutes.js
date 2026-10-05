const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const isAuthenticated = require("../../middlewares/private");

// Routes publiques : il faut pouvoir se connecter sans jeton.
router.use("/auth", authRoutes);

// Toutes les routes déclarées après cette ligne sont privées.
router.use(isAuthenticated);

router.use("/users", userRoutes);

// Tes futures routes privées pourront être ajoutées ici.
// router.use("/reservations", reservationRoutes);
// router.use("/catways", catwayRoutes);

module.exports = router;
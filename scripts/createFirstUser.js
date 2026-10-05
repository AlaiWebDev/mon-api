require("dotenv").config();

const mongoose = require("mongoose");
const userService = require("../services/userService");

async function main() {
    try {
        // Même base que celle utilisée dans ton app.js (local ou cluster mongoDB Atlas).
        await mongoose.connect("mongodb://localhost:27017/exemple-api");

        await userService.createUser({
            nom: "Alain",
            email: process.env.FIRST_USER_EMAIL,
            password: process.env.FIRST_USER_PASSWORD
        });

        console.log("Premier utilisateur créé");
    } finally {
        await mongoose.disconnect();
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
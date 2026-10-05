const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
            type: String,
            required: true,
            select: false
  },
  age: { type: Number }
}, 
  {timestamps: true} // ➜ ajoute automatiquement createdAt et updatedAt}
);
// Ne jamais inclure le mot de passe dans les réponses JSON.
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
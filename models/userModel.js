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
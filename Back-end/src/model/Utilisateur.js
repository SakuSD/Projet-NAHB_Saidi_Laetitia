import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    pseudo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },

    role: {
        type: String,
        enum: ["lecteur", "auteur", "admin"],
        default: "lecteur"
    },

    isAdmin: { type: Boolean, default: false }
});

export default mongoose.model("Utilisateur", userSchema);

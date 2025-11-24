import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    pseudo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);

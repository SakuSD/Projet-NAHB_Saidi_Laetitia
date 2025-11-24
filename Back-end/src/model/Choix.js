import mongoose from "mongoose";

const choixSchema = new mongoose.Schema({
    pageSourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true },
    texte: { type: String, required: true },
    pageDestinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true }
});

export default mongoose.model("Choix", choixSchema);

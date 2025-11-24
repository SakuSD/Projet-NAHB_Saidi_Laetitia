import mongoose from "mongoose";

const partieSchema = new mongoose.Schema({
    lecteurId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    histoireId: { type: mongoose.Schema.Types.ObjectId, ref: "Histoire", required: true },
    pageFinId: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Partie", partieSchema);

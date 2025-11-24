import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    histoireId: { type: mongoose.Schema.Types.ObjectId, ref: "Histoire", required: true },
    contenu: { type: String, required: true },
    isFin: { type: Boolean, default: false },
});

export default mongoose.model("Page", pageSchema);

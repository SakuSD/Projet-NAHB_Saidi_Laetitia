import mongoose from "mongoose";

const histoireSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: String,
    statut: { 
        type: String, 
        enum: ["draft", "published", "banned"], 
        default: "draft" 
    },
    tags: [String],
    pageDepartId: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
    isBanned: { type: Boolean, default: false },
    auteurId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model("Histoire", histoireSchema);

import express from "express";
import { enregistrerPartie, getStatsHistoires } from "../controllers/partieController.js";

const router = express.Router();

router.post("/", enregistrerPartie);

// Stats admin
router.get("/stats", getStatsHistoires);

export default router;

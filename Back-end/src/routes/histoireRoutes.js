import express from "express";
import {
    createHistoire,
    getHistoiresPubliees,
    getHistoiresByAuteur,
    updateHistoire,
    deleteHistoire,
    updateStatutHistoire,
    publishHistoire,
    banHistoire
} from "../controllers/histoireController.js";

const router = express.Router();

// CRUD de base
router.post("/", createHistoire);
router.get("/publiees", getHistoiresPubliees);
router.get("/auteur/:auteurId", getHistoiresByAuteur);
router.put("/:id", updateHistoire);
router.delete("/:id", deleteHistoire);

// Nouveau endpoint : changer statut
router.put("/:id/statut", updateStatutHistoire);

// Actions spécifiques
router.put("/:id/publish", publishHistoire);
router.put("/:id/ban", banHistoire);

export default router;

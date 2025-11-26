import express from "express";
import {
    createPage,
    updatePage,
    deletePage,
    getPagesByHistoire,
    setPageDebut,
} from "../controllers/pageController.js";

const router = express.Router();

// CRUD
router.post("/", createPage);
router.get("/:histoireId", getPagesByHistoire);
router.put("/:id", updatePage);
router.delete("/:id", deletePage);

// Définir la page de début
router.put("/:id/debut", setPageDebut);

export default router;

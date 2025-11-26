import express from "express";
import {
    createChoix,
    updateChoix,
    deleteChoix,
    getChoixByPage
} from "../controllers/choixController.js";

const router = express.Router();

router.post("/", createChoix);                // créer un choix
router.get("/:pageId", getChoixByPage);       // récupérer les choix d’une page
router.put("/:id", updateChoix);              // modifier un choix
router.delete("/:id", deleteChoix);           // supprimer un choix

export default router;

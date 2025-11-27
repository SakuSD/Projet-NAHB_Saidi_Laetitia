import express from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
    banUser,
    unbanUser,
    suspendHistoire,
    reactivateHistoire,
    unsuspendHistoire,
    statsHistoires
} from "../controllers/adminController.js";

const router = express.Router();

router.put("/utilisateur/:id/ban", isAdmin, banUser);
router.put("/utilisateur/:id/unban", isAdmin, unbanUser);

router.put("/histoire/:id/suspend", isAdmin, suspendHistoire);
router.put("/histoire/:id/unsuspend", isAdmin, unsuspendHistoire);
router.put("/histoire/:id/reactivate", isAdmin, reactivateHistoire);

router.get("/stats/histoires", isAdmin, statsHistoires);

export default router;

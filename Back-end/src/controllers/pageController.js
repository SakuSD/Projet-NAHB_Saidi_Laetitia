import { db } from "../config/db.js";

// =============================
// CRÉER UNE PAGE
// =============================
export const createPage = async (req, res) => {
    try {
        const { histoireId, contenu, isDebut, isFin } = req.body;

        if (!histoireId || !contenu) {
            return res.status(400).json({ error: "histoireId et contenu requis." });
        }

        // si la page est définie comme la page de début
        if (isDebut) {
            await db.query(
                `UPDATE pages SET isDebut = FALSE WHERE histoireId = ?`,
                [histoireId]
            );
        }

        const [result] = await db.query(
            `INSERT INTO pages (histoireId, contenu, isDebut, isFin)
             VALUES (?, ?, ?, ?)`,
            [histoireId, contenu, isDebut ?? false, isFin ?? false]
        );

        res.status(201).json({
            id: result.insertId,
            histoireId,
            contenu,
            isDebut,
            isFin
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// RÉCUPÉRER TOUTES LES PAGES D'UNE HISTOIRE
// =============================
export const getPagesByHistoire = async (req, res) => {
    try {
        const { histoireId } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM pages WHERE histoireId = ? ORDER BY id ASC`,
            [histoireId]
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// METTRE À JOUR UNE PAGE
// =============================
export const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenu, isFin } = req.body;

        const fields = [];
        const params = [];

        if (contenu !== undefined) {
            fields.push("contenu = ?");
            params.push(contenu);
        }

        if (isFin !== undefined) {
            fields.push("isFin = ?");
            params.push(isFin);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Aucune donnée à mettre à jour." });
        }

        params.push(id);

        await db.query(
            `UPDATE pages SET ${fields.join(", ")} WHERE id = ?`,
            params
        );

        const [updated] = await db.query(
            `SELECT * FROM pages WHERE id = ?`,
            [id]
        );

        res.json(updated[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// SUPPRIMER UNE PAGE
// =============================
export const deletePage = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM pages WHERE id = ?`, [id]);

        res.json({ message: "Page supprimée avec succès." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// DÉFINIR UNE PAGE DE DÉBUT
// =============================
export const setPageDebut = async (req, res) => {
    try {
        const { id } = req.params;

        // récupérer l'histoire de la page
        const [[page]] = await db.query(
            `SELECT histoireId FROM pages WHERE id = ?`,
            [id]
        );

        if (!page) {
            return res.status(404).json({ error: "Page introuvable." });
        }

        // retirer la page de début actuelle
        await db.query(
            `UPDATE pages SET isDebut = FALSE WHERE histoireId = ?`,
            [page.histoireId]
        );

        // définir la nouvelle page de début
        await db.query(
            `UPDATE pages SET isDebut = TRUE WHERE id = ?`,
            [id]
        );

        res.json({ message: "Page de début définie avec succès." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

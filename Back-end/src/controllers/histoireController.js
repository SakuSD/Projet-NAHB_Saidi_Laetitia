import Histoire from "../model/Histoire.js";
import Page from "../model/Page.js";

// CRÉER UNE HISTOIRE
export const createHistoire = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Utilisateur non connecté." });
        }

        const { titre, description, tags } = req.body;

        const nouvelleHistoire = await Histoire.create({
            titre,
            description,
            tags,
            auteurId: req.session.userId
        });

        res.status(201).json(nouvelleHistoire);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// HISTOIRES PUBLIÉES
export const getHistoiresPubliees = async (req, res) => {
    try {
        const histoires = await Histoire.find({ statut: "published", isBanned: false });
        res.json(histoires);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// HISTOIRES D'UN AUTEUR
export const getHistoiresByAuteur = async (req, res) => {
    try {
        const { auteurId } = req.params;
        const histoires = await Histoire.find({ auteurId });
        res.json(histoires);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// METTRE À JOUR
export const updateHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const histoire = await Histoire.findByIdAndUpdate(id, req.body, { new: true });
        res.json(histoire);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// SUPPRIMER
export const deleteHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        await Page.deleteMany({ histoireId: id });
        await Histoire.findByIdAndDelete(id);
        res.json({ message: "Histoire supprimée avec toutes ses pages." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUBLIER
export const publishHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const histoire = await Histoire.findByIdAndUpdate(
            id, 
            { statut: "published" },
            { new: true }
        );
        res.json(histoire);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// BANNIR
export const banHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const histoire = await Histoire.findByIdAndUpdate(
            id,
            { isBanned: true, statut: "banned" },
            { new: true }
        );
        res.json(histoire);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

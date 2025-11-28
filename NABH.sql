DROP DATABASE IF EXISTS livreinteractif;

CREATE DATABASE livreinteractif CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE livreinteractif;
CREATE TABLE utilisateurs (
    id INT NOT NULL AUTO_INCREMENT,
    pseudo VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    role ENUM('lecteur', 'auteur', 'admin') NOT NULL DEFAULT 'lecteur',
    estBanni TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE histoires (
    id INT NOT NULL AUTO_INCREMENT,
    auteurId INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    tags VARCHAR(255),
    statut ENUM('draft','published','banned') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (auteurId) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE pages (
    id INT NOT NULL AUTO_INCREMENT,
    histoireId INT NOT NULL,
    contenu TEXT NOT NULL,
    isDebut TINYINT(1) NOT NULL DEFAULT 0,
    isFin TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (histoireId) REFERENCES histoires(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE choix (
    id INT NOT NULL AUTO_INCREMENT,
    pageId INT NOT NULL,
    texte VARCHAR(255) NOT NULL,
    prochainePageId INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (pageId) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (prochainePageId) REFERENCES pages(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE parties (
    id INT NOT NULL AUTO_INCREMENT,
    utilisateurId INT NOT NULL,
    histoireId INT NOT NULL,
    pageFinId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (histoireId) REFERENCES histoires(id) ON DELETE CASCADE,
    FOREIGN KEY (pageFinId) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

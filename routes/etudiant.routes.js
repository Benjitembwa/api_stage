import express from "express";
import {
  loginEtudiant,
  registerEtudiant,
} from "../controllers/etudiant.controller.js";

const etudiantRoutes = express.Router();

// Inscription
etudiantRoutes.post("/register", registerEtudiant);

// Connexion
etudiantRoutes.post("/login", loginEtudiant);

export default etudiantRoutes;

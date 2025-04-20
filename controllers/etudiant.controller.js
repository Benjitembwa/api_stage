import bcrypt from "bcryptjs";
import Etudiant from "../models/Etudiant.model.js";

// Inscription
export const registerEtudiant = async (req, res) => {
  try {
    const { nom, postNom, prenom, email, motDePasse, promotion, mention } =
      req.body;
    console.log(req.body);
    // Vérification des champs requis
    if (
      !nom ||
      !postNom ||
      !prenom ||
      !email ||
      !motDePasse ||
      !promotion ||
      !mention
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Validation de l'email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Email invalide." });
    }

    const existing = await Etudiant.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const nouvelEtudiant = new Etudiant({
      nom,
      postNom,
      prenom,
      email,
      motDePasse: hashedPassword,
      promotion,
      mention,
    });

    await nouvelEtudiant.save();
    res.status(201).json({ message: "Étudiant inscrit avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

// Connexion
export const loginEtudiant = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    console.log("Tentative de login avec :", email, motDePasse);

    const etudiant = await Etudiant.findOne({ email });
    if (!etudiant) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const passwordMatch = await bcrypt.compare(motDePasse, etudiant.motDePasse);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    res.json({
      message: "Connexion réussie",
      utilisateur: {
        id: etudiant._id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        role: etudiant.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

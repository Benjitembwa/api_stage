import express from "express";
import cors from "cors";

import { PORT } from "./config/env.js";
import etudiantRoutes from "./routes/etudiant.routes.js";

import connectDB from "./database/mongodb.js";
import mentionRoutes from "./routes/mention.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";
import personnelRoutes from "./routes/personnel.route.js";
import typesDocumentRoutes from "./routes/typesDocument.routes.js";
import attenteRoutes from "./routes/attente.routes.js";
import utilisateursRoutes from "./routes/utilisateurs.route.js";
import documentRoutes from "./routes/document.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/etudiants", etudiantRoutes);
app.use("/api/mentions", mentionRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/personnels", personnelRoutes);
app.use("/api/types-documents", typesDocumentRoutes);
app.use("/api/attentes", attenteRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT || 5000}`);
});

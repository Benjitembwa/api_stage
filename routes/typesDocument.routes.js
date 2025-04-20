import express from "express";
import { getAllTypesDocuments } from "../controllers/typesDocument.controller.js";

const typesDocumentRoutes = express.Router();

typesDocumentRoutes.get("/", getAllTypesDocuments);

export default typesDocumentRoutes;

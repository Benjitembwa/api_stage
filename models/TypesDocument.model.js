// models/TypesDocument.js
import mongoose from "mongoose";

const typesDocumentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
});

const TypesDocument = mongoose.model("TypesDocument", typesDocumentSchema);

export default TypesDocument;

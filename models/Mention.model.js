// models/Mention.js
import mongoose from "mongoose";

const mentionSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
});

const Mention = mongoose.model("Mention", mentionSchema);
export default Mention;

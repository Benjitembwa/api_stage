// models/Promotion.js
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;

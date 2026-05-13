const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 120 },
  vendorName: { type: String, default: "Digital Heroes Official" },
  isApproved: { type: Boolean, default: true }, // default true for internal, false for submissions
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);

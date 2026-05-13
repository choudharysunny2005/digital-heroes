import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    imageUrl: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 120 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    inventory: { type: Number, default: 100 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

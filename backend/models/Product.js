const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Home", "Kitchen", "Pooja", "Personal"],
    },
    tag: {
      type: String,
      enum: ["Bestseller", "New", "Eco Pick", "Popular", ""],
      default: "",
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

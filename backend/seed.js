/**
 * seed.js — Run once to populate DB
 * Usage: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Product = require("./models/Product");

const sampleProducts = [
  { name: "Handwoven Bamboo Basket", description: "Traditional hand-woven basket by Assam artisans. Perfect for storage or décor.", price: 649, mrp: 899, category: "Home", tag: "Bestseller", image: "https://images.unsplash.com/photo-1609355204259-ca1b8fbd38fd?w=600&q=80" },
  { name: "Bamboo Diya Stand", description: "Elegant bamboo stand for diyas — brings warmth to your home altar.", price: 349, mrp: 499, category: "Pooja", tag: "Eco Pick", image: "https://images.unsplash.com/photo-1605128806570-81571e2abc01?w=600&q=80" },
  { name: "Bamboo Floor Mat", description: "Sturdy bamboo floor mat. Naturally anti-bacterial and easy to clean.", price: 899, mrp: 1299, category: "Home", tag: "New", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80" },
  { name: "Bamboo Water Bottle", description: "Food-grade bamboo & stainless steel. Zero plastic, 100% natural.", price: 549, mrp: 750, category: "Kitchen", tag: "Popular", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80" },
  { name: "Bamboo Kitchen Set", description: "8-piece bamboo utensil set — spoons, spatula, ladle. Toxin-free.", price: 1199, mrp: 1599, category: "Kitchen", tag: "", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
  { name: "Bamboo Toothbrush Pack", description: "Biodegradable pack of 4. BPA-free bristles, naturally antibacterial.", price: 299, mrp: 399, category: "Personal", tag: "Eco Pick", image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80" },
  { name: "Bamboo Photo Frame", description: "Hand-etched bamboo photo frame. A gift of memories and nature.", price: 449, mrp: 599, category: "Home", tag: "", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80" },
  { name: "Bamboo Yoga Mat Bag", description: "Carry your yoga mat in style — woven bamboo & jute bag.", price: 799, mrp: 1099, category: "Personal", tag: "New", image: "https://images.unsplash.com/photo-1601925228886-0a47a65e1ffa?w=600&q=80" },
];

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Product.deleteMany();
  await Admin.deleteMany();

  // Create admin
  await Admin.create({
    email: process.env.ADMIN_EMAIL || "admin@hanbamboo.in",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  });

  // Create products
  await Product.insertMany(sampleProducts);

  console.log("✅ Seed complete!");
  console.log(`   Admin: ${process.env.ADMIN_EMAIL}`);
  console.log(`   Products: ${sampleProducts.length} created`);
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

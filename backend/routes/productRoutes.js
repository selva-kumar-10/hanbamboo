const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/auth");
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getAdminProducts,
} = require("../controllers/productController");

// ── Admin route MUST come before /:id ────────────────────────
router.get("/admin/all", protect, getAdminProducts);

// ── Public routes ─────────────────────────────────────────────
router.get("/",    getProducts);
router.get("/:id", getProduct);

// ── Admin CRUD ────────────────────────────────────────────────
router.post("/",        protect, createProduct);
router.put("/:id",      protect, updateProduct);
router.delete("/:id",   protect, deleteProduct);

module.exports = router;
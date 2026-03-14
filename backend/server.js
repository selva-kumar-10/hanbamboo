require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const adminRoutes   = require("./routes/adminRoutes");
const uploadRoutes  = require("./routes/uploadRoutes");

connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/upload",   uploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "HanBamboo API running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Express v5 error handler — must have 4 params
app.use((err, req, res, next) => {
  console.error(err);
  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "Image too large. Max 5MB." });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ success: false, message: "Unexpected file field. Use 'image'." });
  }
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
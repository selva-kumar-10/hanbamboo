const express     = require("express");
const router      = express.Router();
const path        = require("path");
const fs          = require("fs");
const { protect } = require("../middleware/auth");
const upload      = require("../middleware/upload");

// ── POST /api/upload ──────────────────────────────────────────
// multer used directly as middleware (not callback style — Express v5 compatible)
router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl, filename: req.file.filename });
});

// ── DELETE /api/upload/:filename ──────────────────────────────
router.delete("/:filename", protect, (req, res) => {
  const uploadDir = path.join(__dirname, "../uploads");
  const filePath  = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ success: true, message: "Image deleted" });
  }
  res.status(404).json({ success: false, message: "File not found" });
});

module.exports = router;
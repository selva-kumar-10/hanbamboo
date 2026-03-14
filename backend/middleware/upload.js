const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// ── Make sure uploads folder exists ──────────────────────────
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── Storage: unique filename, keep extension ──────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "-").toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// ── Multer v2 compatible: NO fileFilter callback ──────────────
// Validate mime type manually inside the route instead
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
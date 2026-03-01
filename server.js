import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve working directory safely
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const rootDir = process.platform === "win32" ? __dirname.replace(/^\//, "") : __dirname;

const publicDir = path.join(rootDir, "public");
const certDir = path.join(publicDir, "assets", "certificates");

// Serve static frontend + assets
app.use(express.static(publicDir));

// API: list certificates (auto-reads folder)
app.get("/api/certificates", (req, res) => {
  try {
    const files = fs
      .readdirSync(certDir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));

    res.json({
      ok: true,
      certificates: files.map((f) => ({
        file: f,
        viewUrl: `/assets/certificates/${encodeURIComponent(f)}`,
        downloadUrl: `/download/certificate/${encodeURIComponent(f)}`
      }))
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Could not read certificates folder." });
  }
});

// Download route (forces download)
app.get("/download/certificate/:filename", (req, res) => {
  const filename = req.params.filename;

  // Security: block traversal
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return res.status(400).send("Invalid filename.");
  }

  const filePath = path.join(certDir, filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("Certificate not found.");

  res.download(filePath, filename);
});

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✅ Digital CV running: http://localhost:${PORT}`);
});

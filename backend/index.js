require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const docxConverter = require("docx-pdf");
const path = require("path");
const cors = require("cors");

app.use(cors());

// Setting up the file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/convertfile", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please Upload a file.",
      });
    }
    // Difining output path
    const fileName = path.basename(
      req.file.originalname,
      path.extname(req.file.originalname)
    );
    const outputPath = path.join(__dirname, "files", `${fileName}.pdf`);

    docxConverter(req.file.path, outputPath, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error in converting docx to pdf",
        });
      }
      res.download(outputPath, () => {
        console.log("File Downloaded");
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});

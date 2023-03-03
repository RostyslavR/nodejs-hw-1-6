const multer = require("multer");
const path = require("path");

const tmp = path.join(__dirname, "..", "tmp");

const storage = multer.diskStorage({
  destination: tmp,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;

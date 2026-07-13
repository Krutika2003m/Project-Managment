const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/users");
    console.log(uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const uploadImage = multer({ storage });

module.exports = uploadImage;
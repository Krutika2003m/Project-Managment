const multer =require('multer')
const path = require("path");

const storage = multer.diskStorage({
    destination:(req,file, cb)=>{
      console.log("*******")
        cb(null, 'uploads/taskFiles')
    },
    filename:(req, file,cb)=>{
      console.log("******* filename", file)

        const uniqueName = Date.now()+ "-" + file.originalname
        console.log(uniqueName)
        cb(null,uniqueName)
    }
})


const fileFilter =(req, file, cb)=>{
    const allowedTypes = /pdf|doc|docx/

    const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedMimeTypes.includes(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC files are allowed"));
  }

}

const uploadFiles = multer({
  storage,
  fileFilter,
});

module.exports = uploadFiles
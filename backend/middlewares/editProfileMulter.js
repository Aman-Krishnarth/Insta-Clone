

import multer from "multer";

const storage = multer.memoryStorage(); // Use memory storage to get file buffer

const editUpload = multer({ storage });

export default editUpload;

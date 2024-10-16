import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
  console.log("get data uri mein hu")
  // console.log(file.buffer)
  // console.log(file)
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content;
};
export default getDataUri;

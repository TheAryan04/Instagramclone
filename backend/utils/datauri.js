import DataURIParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    const parser = new DataURIParser(); 
    return parser.format(extName, file.buffer).content;
};
export default getDataUri;
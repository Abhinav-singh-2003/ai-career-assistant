"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPDF = void 0;
const fs_1 = __importDefault(require("fs")); //21
const pdf_parse_1 = require("pdf-parse");
const extractTextFromPDF = async (filePth) => {
    const fileBuffer = fs_1.default.readFileSync(filePth); // help to read file and store a raw binary data in buffer..
    const parser = new pdf_parse_1.PDFParse({ data: fileBuffer }); // create a new instance of the PDFParse class, passing the file buffer as data. This prepares the parser to extract text from the PDF file.
    const result = await parser.getText();
    await parser.destroy();
    return result.text; // return the extracted data in the text format ..
};
exports.extractTextFromPDF = extractTextFromPDF;
//# sourceMappingURL=pdfService.js.map
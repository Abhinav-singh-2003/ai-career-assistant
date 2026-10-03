import fs from "fs";//21
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async(filePth:string) : Promise<string>=>{

    const fileBuffer = fs.readFileSync(filePth);// help to read file and store a raw binary data in buffer..
    const parser = new PDFParse({ data: fileBuffer });// create a new instance of the PDFParse class, passing the file buffer as data. This prepares the parser to extract text from the PDF file.
    const result = await parser.getText();
    await parser.destroy();
    return result.text;// return the extracted data in the text format ..

};
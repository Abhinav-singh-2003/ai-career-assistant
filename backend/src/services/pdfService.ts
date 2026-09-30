import fs from "fs";//21
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async(filePth:string) : Promise<string>=>{

    const fileBuffer = fs.readFileSync(filePth);// help to read file and store a raw binary data in buffer..
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;// return the extracted data in the text format ..

};
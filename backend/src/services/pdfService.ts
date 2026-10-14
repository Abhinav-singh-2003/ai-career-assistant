import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async(filePath: string): Promise<string> => {
    const fileBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    try {
        const result = await parser.getText();
        return result.text;
    } finally {
        await parser.destroy();
    }
};
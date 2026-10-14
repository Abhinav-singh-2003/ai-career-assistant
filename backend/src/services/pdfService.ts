import fs from "fs/promises";

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
    const fileBuffer = await fs.readFile(filePath);

    const canvas = await import("@napi-rs/canvas");
    Object.assign(globalThis, {
        DOMMatrix: canvas.DOMMatrix,
        ImageData: canvas.ImageData,
        Path2D: canvas.Path2D,
    });

    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: fileBuffer });
    try {
        const result = await parser.getText();
        return result.text;
    } finally {
        await parser.destroy();
    }
};
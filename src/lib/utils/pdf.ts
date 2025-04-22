import pdfParse from 'pdf-parse';

// Configuration pour éviter les erreurs de fichiers manquants
const pdfParseConfig = {
  pagerender: (pageData: any) => {
    return pageData.getTextContent();
  }
};

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const data = await pdfParse(Buffer.from(buffer), pdfParseConfig);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}

export function isValidPDF(file: File): boolean {
  return file.type === 'application/pdf';
} 
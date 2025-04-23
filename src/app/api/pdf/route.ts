import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convertir le fichier en ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Extraire le texte du PDF
    const text = await extractTextFromPDF(buffer);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}

async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Utiliser pdf-parse pour extraire le texte
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(Buffer.from(buffer));
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
} 
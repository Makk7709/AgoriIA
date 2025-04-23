import { NextResponse } from 'next/server';
import { themes } from '@/lib/openai/config';

export async function GET() {
  try {
    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
} 
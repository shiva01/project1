import { NextResponse } from 'next/server';
import { scrapeData } from '../../../lib/scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'lack token parateter' }, { status: 400 });
  }

  try {
    const data = await scrapeData(token);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('failed to get the data:', error);
    return NextResponse.json({ error: 'failed to get the data' }, { status: 500 });
  }
}
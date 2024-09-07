import { NextResponse } from 'next/server';
import { scrapeData } from '../../../lib/scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: '缺少 token 参数' }, { status: 400 });
  }

  try {
    const data = await scrapeData(token);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('爬取过程中出错:', error);
    return NextResponse.json({ error: '爬取数据失败' }, { status: 500 });
  }
}
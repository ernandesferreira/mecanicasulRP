import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const boxes = await prisma.box.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(boxes);
  } catch (error) {
    console.error('GET /api/boxes error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, image } = await request.json();

    if (!name || price == null) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 });
    }

    const box = await prisma.box.create({ data: { name, price, image } });
    return NextResponse.json(box, { status: 201 });
  } catch (error) {
    console.error('POST /api/boxes error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

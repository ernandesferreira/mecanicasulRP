import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(services);
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, image, hasDisplacement } = await request.json();

    if (!name || price == null) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: { name, price, image, hasDisplacement: hasDisplacement ?? false },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, cost, partnership, description, image } = await request.json();

    if (!name || price == null || cost == null) {
      return NextResponse.json({ error: 'Nome, preço e custo são obrigatórios' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, price, cost, partnership, description, image },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

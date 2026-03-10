import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const partnerships = await prisma.partnership.findMany({
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(partnerships);
  } catch (error) {
    console.error('GET /api/partnerships error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, items } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const partnership = await prisma.partnership.create({
      data: {
        name,
        items: {
          create: (items ?? []).map((item: { name: string; type: string; partnerPrice: number }) => ({
            name: item.name,
            type: item.type,
            partnerPrice: item.partnerPrice,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(partnership, { status: 201 });
  } catch (error) {
    console.error('POST /api/partnerships error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

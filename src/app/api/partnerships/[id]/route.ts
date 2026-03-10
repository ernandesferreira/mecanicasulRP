import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const partnership = await prisma.partnership.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!partnership) return NextResponse.json({ error: 'Parceria não encontrada' }, { status: 404 });
    return NextResponse.json(partnership);
  } catch (error) {
    console.error('GET /api/partnerships/[id] error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, items } = await request.json();

    // Delete old items and create new ones (simplest approach for nested relations)
    await prisma.partnershipItem.deleteMany({ where: { partnershipId: id } });

    const partnership = await prisma.partnership.update({
      where: { id },
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

    return NextResponse.json(partnership);
  } catch (error) {
    console.error('PUT /api/partnerships/[id] error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar parceria' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.partnership.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/partnerships/[id] error:', error);
    return NextResponse.json({ error: 'Erro ao excluir parceria' }, { status: 500 });
  }
}

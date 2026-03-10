import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    console.error('GET /api/services/[id] error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, price, image, hasDisplacement } = await request.json();

    const service = await prisma.service.update({
      where: { id },
      data: { name, price, image, hasDisplacement },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('PUT /api/services/[id] error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar serviço' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/services/[id] error:', error);
    return NextResponse.json({ error: 'Erro ao excluir serviço' }, { status: 500 });
  }
}

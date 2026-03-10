import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const box = await prisma.box.findUnique({ where: { id } });
    if (!box) return NextResponse.json({ error: 'Box não encontrado' }, { status: 404 });
    return NextResponse.json(box);
  } catch (error) {
    console.error('GET /api/boxes/[id] error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, price, image } = await request.json();

    const box = await prisma.box.update({
      where: { id },
      data: { name, price, image },
    });

    return NextResponse.json(box);
  } catch (error) {
    console.error('PUT /api/boxes/[id] error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar box' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.box.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/boxes/[id] error:', error);
    return NextResponse.json({ error: 'Erro ao excluir box' }, { status: 500 });
  }
}

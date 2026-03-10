import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const adminCount = await prisma.user.count({ where: { role: 'admin' } });
    return NextResponse.json({ hasAdmin: adminCount > 0 });
  } catch (error) {
    console.error('has-admin error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

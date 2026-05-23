import { prisma } from '@/lib/prisma';
import { toClientMessage } from '@/lib/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const _user = session?.user as User & { id?: string };

  if (!session || !_user?.id) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: { userId: _user.id },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json(
      {
        success: true,
        messages: messages.map(toClientMessage),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

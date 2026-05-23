import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { User } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as User & { id?: string };

  if (!session || !user?.id) {
    return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const { acceptMessages } = await request.json();

  try {
    const updateResult = await prisma.user.updateMany({
      where: { id: user.id },
      data: { isAcceptingMessages: acceptMessages },
    });

    if (updateResult.count === 0) {
      return Response.json(
        { success: false, message: 'User not found to update' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        isAcceptingMessages: acceptMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating status:', error);
    return Response.json(
      { success: false, message: 'Server error updating status' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as User & { id?: string };

  if (!session || !user?.id) {
    return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isAcceptingMessages: true },
    });

    if (!foundUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving status:', error);
    return Response.json(
      { success: false, message: 'Server error retrieving status' },
      { status: 500 }
    );
  }
}

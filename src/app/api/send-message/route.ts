import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const messageSchema = z.object({
  username: z.string().min(3),
  content: z.string().min(1, 'Message cannot be empty'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.errors.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { username, content } = result.data;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: 'User is not accepting messages' },
        { status: 403 }
      );
    }

    await prisma.message.create({
      data: {
        content,
        userId: user.id,
      },
    });

    return Response.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

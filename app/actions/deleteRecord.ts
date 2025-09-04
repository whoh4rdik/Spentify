'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function deleteRecord(recordId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  // Get the database user using the clerkUserId
  const dbUser = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!dbUser) {
    return { error: 'Database user not found' };
  }

  try {
    await db.record.delete({
      where: {
        id: recordId,
        userId: dbUser.id, // Use database user ID
      },
    });

    revalidatePath('/');

    return { message: 'Record deleted' };
  } catch (error) {
    console.error('Error deleting record:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default deleteRecord;

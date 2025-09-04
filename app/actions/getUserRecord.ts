'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

async function getUserRecord(): Promise<{
  record?: number;
  daysWithRecords?: number;
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
    const records = await db.record.findMany({
      where: { userId: dbUser.id }, // Use database user ID
    });

    const record = records.reduce((sum, record) => sum + record.amount, 0);

    // Count the number of days with valid sleep records
    const daysWithRecords = records.filter(
      (record) => record.amount > 0
    ).length;

    return { record, daysWithRecords };
  } catch (error) {
    console.error('Error fetching user record:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default getUserRecord;

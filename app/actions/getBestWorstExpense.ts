'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

async function getBestWorstExpense(): Promise<{
  bestExpense?: number;
  worstExpense?: number;
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
    // Fetch all records for the authenticated user
    const records = await db.record.findMany({
      where: { userId: dbUser.id }, // Use database user ID
      select: { amount: true }, // Fetch only the `amount` field for efficiency
    });

    if (!records || records.length === 0) {
      return { bestExpense: 0, worstExpense: 0 }; // Return 0 if no records exist
    }

    const amounts = records.map((record) => record.amount);

    // Calculate best and worst expense amounts
    const bestExpense = Math.max(...amounts); // Highest amount
    const worstExpense = Math.min(...amounts); // Lowest amount

    return { bestExpense, worstExpense };
  } catch (error) {
    console.error('Error fetching expense amounts:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default getBestWorstExpense;

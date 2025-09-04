'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface RecordData {
  text: string;
  amount: number;
  category: string;
  date: string; // Added date field
}

interface RecordResult {
  data?: RecordData;
  error?: string;
}

async function addExpenseRecord(formData: FormData): Promise<RecordResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');
  const categoryValue = formData.get('category');
  const dateValue = formData.get('date'); // Extract date from formData

  // Check for input values
  if (
    !textValue ||
    textValue === '' ||
    !amountValue ||
    !categoryValue ||
    categoryValue === '' ||
    !dateValue ||
    dateValue === ''
  ) {
    return { error: 'Text, amount, category, or date is missing' };
  }

  const text: string = textValue.toString().trim(); // Ensure text is a string and trim whitespace
  const amount: number = parseFloat(amountValue.toString()); // Parse amount as number
  const category: string = categoryValue.toString().trim(); // Ensure category is a string and trim whitespace
  
  // Validate amount
  if (isNaN(amount) || amount <= 0 || amount > 1000000) {
    return { error: 'Amount must be a positive number less than 1,000,000' };
  }
  
  // Validate text length
  if (text.length > 500) {
    return { error: 'Description must be less than 500 characters' };
  }
  
  // Validate category
  const validCategories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'];
  if (!validCategories.includes(category)) {
    return { error: 'Invalid category selected' };
  }
  // Convert date to ISO-8601 format while preserving the user's input date
  let date: string;
  try {
    // Parse the date string (YYYY-MM-DD format) and create a date at noon UTC to avoid timezone issues
    const inputDate = dateValue.toString();
    const [year, month, day] = inputDate.split('-');
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error('Invalid date format:', error); // Log the error
    return { error: 'Invalid date format' };
  }

  // Get logged in user
  const { userId } = await auth();

  // Check for user
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
    // Create a new record (allow multiple expenses per day)
    const createdRecord = await db.record.create({
      data: {
        text,
        amount,
        category,
        date, // Save the date to the database
        userId: dbUser.id, // Use database user ID, not clerkUserId
      },
    });

    const recordData: RecordData = {
      text: createdRecord.text,
      amount: createdRecord.amount,
      category: createdRecord.category,
      date: createdRecord.date?.toISOString() || date,
    };

    revalidatePath('/');

    return { data: recordData };
  } catch (error) {
    console.error('Error adding expense record:', error); // Log the error
    return {
      error: 'An unexpected error occurred while adding the expense record.',
    };
  }
}

export default addExpenseRecord;

import { currentUser } from '@clerk/nextjs/server';

import { db } from './db';

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (loggedInUser) {
    return loggedInUser;
  }

  // Get email address safely
  const emailAddress = user.emailAddresses?.[0]?.emailAddress;
  if (!emailAddress) {
    console.error('No email address found for user:', user.id);
    return null;
  }

  // Check if user exists by email to avoid duplicate creation
  const existingUserByEmail = await db.user.findUnique({
    where: {
      email: emailAddress,
    },
  });

  if (existingUserByEmail) {
    // Update the existing user with the clerk ID
    const updatedUser = await db.user.update({
      where: {
        email: emailAddress,
      },
      data: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        imageUrl: user.imageUrl,
      },
    });
    return updatedUser;
  }

  try {
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        imageUrl: user.imageUrl,
        email: emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.error('Error creating new user:', error);
    // If creation fails, try to find user by clerkUserId again
    return await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
  }
};

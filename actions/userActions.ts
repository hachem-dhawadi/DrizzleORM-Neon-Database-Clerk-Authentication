"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export const getAllUsers = async () => {
  const data = await db.select().from(users);
  return data;
};

export const getUser = async (userId: any) => {
  const user = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.clerkId, userId),
    with: {
      todos: true,
    },
  });

  return user;
};

export const addUser = async (user: any) => {
  await db
    .insert(users)
    .values({
      clerkId: user?.clerkId,
      email: user?.email,
      name: user?.name!,
      firstName: user?.firstName,
      lastName: user?.lastName,
      photo: user?.photo,
    })
    .returning({ clerkClientId: users?.clerkId });

  // revalidatePath("/");
};


// Helper to get your local numeric user id from Clerk user id
export const getLocalUserId = async (clerkId: string): Promise<number> => {
  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId));

  if (!userRecord[0]) {
    throw new Error(`No local user found for Clerk ID: ${clerkId}`);
  }

  return userRecord[0].id;
};
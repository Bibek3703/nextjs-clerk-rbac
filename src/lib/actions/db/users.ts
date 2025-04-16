"use server"

import { db } from "@/db";
import { InsertUser, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { handleAuth } from "../clerk/auth";

export async function getUserById(userId?: string): Promise<User | null | undefined> {

    await handleAuth()

    if (!userId) {
        throw new Error("User ID is required")
    }

    const result = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)

    if (result?.length) {
        return result[0]
    }

    return null
}

export async function createUser(user: InsertUser) {
    if (!user?.clerkId) {
        throw new Error("Clerk user ID is required");
    }

    await db.insert(users)
        .values({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

    return { message: "User created" }
}
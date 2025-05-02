"use server"

import { db } from "@/db";
import { InsertUser, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUsers(): Promise<User[] | undefined> {
    return await db.select().from(users) as User[]
}

export async function getUser(userId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (result?.length) {
        return result[0] as User
    }
}

export async function createUser(user: InsertUser) {
    await db.insert(users)
        .values({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    return { message: "User created" }
}

export async function updateUser(userId: string, user: Partial<InsertUser>) {
    await db.update(users)
        .set({
            ...user,
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    return { message: "User updated" }
}

export async function deleteUserByClerkId(userId: string) {
    await db.delete(users)
        .where(eq(users.id, userId));
    return { message: "User deleted" }
}
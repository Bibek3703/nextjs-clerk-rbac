"use server"

import { InsertOrganization, Organization, organizations } from "@/db/schema"
import { db } from "@/db"
import { and, desc, eq } from "drizzle-orm"

// Get all organizations of user
export async function getUserOrganizations(userId: string): Promise<Organization[] | undefined> {

    return await db.select().from(organizations)
        .where(eq(organizations.userId, userId))
        .orderBy(desc(organizations.createdAt))

}

// Get single organization of user
export async function getUserOrganization(userId: string, organizationId: string): Promise<Organization[] | undefined> {
    return await db.select().from(organizations)
        .where(and(
            eq(organizations.userId, userId),
            eq(organizations.id, organizationId)
        ))
        .orderBy(desc(organizations.createdAt))
}

// Create new organization for user
export async function createUserOrganization(
    userId: string,
    organization: InsertOrganization
) {

    return await db.insert(organizations)
        .values({
            ...organization,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
}

// Update user's organization
export async function updateUserOrganization(
    userId: string,
    organizationId: string,
    organization: Partial<Organization>
) {

    return await db.update(organizations)
        .set({
            ...organization,
            updatedAt: new Date(),
        })
        .where(and(
            eq(organizations.id, organizationId),
            eq(organizations.userId, userId)
        ));
}

// Delete user's organization
export async function deleteUserOrganization(organizationId: string) {

    return await db.delete(organizations)
        .where(eq(organizations.id, organizationId));

}


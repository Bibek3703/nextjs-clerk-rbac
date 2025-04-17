"use server"

import { InsertOrganization, Organization, organizations } from "@/db/schema"
import { handleAuth } from "../clerk/auth"
import { db } from "@/db"
import { desc, eq } from "drizzle-orm"

export async function createUserOrganizations(
    organization: InsertOrganization
): Promise<InsertOrganization | null | undefined> {

    // const session = await handleAuth()

    if (!organization.clerkOrgId) {
        throw new Error("Organization ID is required")
    }

    // if (clerkId !== session.userId) {
    //     throw new Error("User is not authorized")
    // }

    await await db.insert(organizations)
        .values({
            ...organization,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

    return organization
}

export async function updateUserOrganizations(
    clerkOrgId: string,
    organization: Partial<Organization>
): Promise<Partial<Organization> | null | undefined> {

    // const session = await handleAuth()

    if (!clerkOrgId) {
        throw new Error("Organization ID is required")
    }

    // if (clerkId !== session.userId) {
    //     throw new Error("User is not authorized")
    // }

    await db.update(organizations)
        .set({
            ...organization,
            updatedAt: new Date(),
        })
        .where(eq(organizations.clerkOrgId, clerkOrgId));

    return organization
}

export async function deleteOrganizationByClerkOrgId(clerkOrgId: string) {
    if (!clerkOrgId) {
        throw new Error("Clerk organization ID is required");
    }
    await db.delete(organizations)
        .where(eq(organizations.clerkOrgId, clerkOrgId));
    return { message: "Organization deleted" }
}

export async function getUserOrganizations(clerkId: string): Promise<Organization[] | null | undefined> {

    const session = await handleAuth()

    if (!clerkId) {
        throw new Error("User ID is required")
    }

    if (clerkId !== session.userId) {
        throw new Error("User is not authorized")
    }

    const result = await db.select().from(organizations).where(eq(organizations.clerkId, clerkId)).orderBy(desc(organizations.createdAt))

    if (result?.length) {
        return result
    }

    return null
}
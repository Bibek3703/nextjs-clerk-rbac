import { Organization, organizations } from "@/db/schema"
import { handleAuth } from "../clerk/auth"
import { db } from "@/db"
import { eq } from "drizzle-orm"

export async function getUserOrganizations(clerkId: string): Promise<Organization[] | null | undefined> {

    const session = await handleAuth()

    if (!clerkId) {
        throw new Error("User ID is required")
    }

    if (clerkId !== session.userId) {
        throw new Error("User is not authorized")
    }

    const result = await db.select().from(organizations).where(eq(organizations.clerkId, clerkId))

    if (result?.length) {
        return result
    }

    return null
}
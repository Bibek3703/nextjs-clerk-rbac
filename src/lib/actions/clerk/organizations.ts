"use server"
import { clerkClient } from "@clerk/nextjs/server";

export type ClerkOrganization = {
    name: string;
    slug?: string;
    image_url?: string;
    createdBy?: string;
}

export async function createOrganization(organization: ClerkOrganization) {
    if (!organization?.name) {
        throw new Error("Organization name is required");
    }
    const client = await clerkClient()
    const res = await client.organizations.createOrganization({ ...organization })

    return {
        id: res.id,
        name: res.name,
        slug: res.slug,
        clerkId: res.createdBy,
        imageUrl: res.imageUrl || null,
    }
}
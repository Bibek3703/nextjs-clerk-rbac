"use server"
import { clerkClient } from "@clerk/nextjs/server";
import { handleAuth } from "./auth";
import { Organization } from "@/db/schema";


export async function createOrganization(organization: Organization) {
    const session = await handleAuth()

    if (!organization?.name) {
        throw new Error("Organization name is required");
    }

    if (!session?.userId) {
        throw new Error("User not authorized to create organization");
    }

    const client = await clerkClient()
    const res = await client.organizations.createOrganization({ ...organization, createdBy: session.userId })

    return {
        id: res.id,
        name: res.name,
        slug: res.slug,
        clerkId: res.createdBy,
        imageUrl: res.imageUrl || null,
    }
}

export async function updateOrganization(organizationId: string, organization: Organization) {
    const session = await handleAuth()

    if (!organization || !organizationId) {
        throw new Error("Organization is required");
    }

    console.log({ session, organization })

    if (!session?.userId || session.userId !== organization.clerkId) {
        throw new Error("User not authorized to create organization");
    }

    const client = await clerkClient()
    const res = await client.organizations.updateOrganization(organizationId, { ...organization })

    return {
        id: res.id,
        name: res.name,
        slug: res.slug,
        clerkId: res.createdBy,
        imageUrl: res.imageUrl || null,
    }
}

export async function deleteOrganization(organizationId: string) {
    const session = await handleAuth()

    if (!organizationId) {
        throw new Error("Organization id is required");
    }

    if (!session?.userId) {
        throw new Error("User not authorized to create organization");
    }

    const client = await clerkClient()
    const res = await client.organizations.deleteOrganization(organizationId)

    return {
        id: res.id,
        name: res.name,
        slug: res.slug,
        clerkId: res.createdBy,
        imageUrl: res.imageUrl || null,
    }
}
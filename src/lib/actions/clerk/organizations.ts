"use server"
import { clerkClient } from "@clerk/nextjs/server";
import { InsertOrganization, Organization } from "@/db/schema";


export async function createOrganization(userId: string, organization: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const client = await clerkClient()
    const res = await client.organizations.createOrganization({
        name: organization?.name || "",
        slug: organization?.slug || undefined,
        createdBy: userId
    })

    if (res) {
        return {
            id: res.id,
            name: res.name,
            slug: res.slug,
            userId: res.createdBy,
            imageUrl: res.imageUrl || null,
        } as Organization
    }
}

export async function updateOrganization(organizationId: string, organization: InsertOrganization): Promise<Organization> {
    const client = await clerkClient()
    const res = await client.organizations.updateOrganization(organizationId, { ...organization })

    return {
        id: res.id,
        name: res.name,
        slug: res.slug,
        imageUrl: res.imageUrl || null,
    } as Organization
}

export async function deleteOrganization(userId: string, organizationId: string): Promise<Organization> {
    const client = await clerkClient()
    const res = await client.organizations.deleteOrganization(organizationId)

    return {
        id: res.id,
        userId: userId
    } as Organization
}
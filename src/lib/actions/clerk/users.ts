import { clerkClient, Organization, OrganizationMembership } from "@clerk/nextjs/server"
import { getUserOrganizations } from "../db/organizations"

export async function updateUserPublicMetadata(userId: string, publicMetadata: Record<string, unknown>) {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const client = await clerkClient()

    const res = await client.users.updateUserMetadata(userId, {
        publicMetadata: publicMetadata,
    })

    return res.publicMetadata
}

export async function deleteUserOrganizations(userId: string) {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const client = await clerkClient()

    const promises: Promise<Organization | OrganizationMembership>[] = [];

    const result = await getUserOrganizations(userId)

    if (result?.length) {
        result.forEach((organization) => {
            promises.push(client.organizations.deleteOrganization(organization.id))
            // promises.push(client.organizations.deleteOrganizationMembership({ userId, organizationId: organization.id }))
        })
    }

    if (promises.length > 0) {
        await Promise.all(promises)
    }

}
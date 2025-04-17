import { clerkClient } from "@clerk/nextjs/server"

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
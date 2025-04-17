"use server"

import { auth } from "@clerk/nextjs/server"

export async function handleAuth() {
    const session = await auth()
    if (!session.userId) {
        throw new Error('User is not authorized');
    }
    return session
}
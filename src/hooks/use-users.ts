"use client"

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";



async function fetchUser(id?: string | null, userId?: string | null) {
    try {
        if (!userId || !id) return null
        const res = await fetch(`/api/users/${userId}`)
        return res.json()
    } catch (error) {
        throw error
    }
}

export function useUser(id?: string | null) {
    const { userId } = useAuth()
    return useQuery({
        queryKey: ["user", { userId }],
        queryFn: () => { return fetchUser(id, userId) },
        enabled: !!userId,
    });
}

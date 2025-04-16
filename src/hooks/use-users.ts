import { User } from "@/db/schema";
import { getUserById } from "@/lib/actions/db/users"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query";



export async function fetchUserById(userId: string): Promise<User | null | undefined> {
    return await getUserById(userId)
}

export function useCurrentUser() {
    const { userId } = useAuth()
    return useQuery({
        queryKey: ["currentUser", userId],
        queryFn: () => {
            try {
                if (userId) {
                    return fetchUserById(userId)
                }
            } catch (error) {
                console.log({ error })
            }
        },
        enabled: !!userId,
    });
}
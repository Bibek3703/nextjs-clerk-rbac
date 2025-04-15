import { roles } from "@/db/schema"

export { }

// Create a type for the roles
export type Roles = typeof roles

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles,
        }
    }
}
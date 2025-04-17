import { Role } from "@/db/schema"

export { }


declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Role,
        }
    }
}
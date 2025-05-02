import { getUsers } from "@/lib/actions/db/users";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        const result = await getUsers()

        return NextResponse.json({ users: result }, { status: 200, statusText: "success" });
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            statusText: "failed"
        });
    }
}
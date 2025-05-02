import { getUser } from "@/lib/actions/db/users";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: Promise<{
        userId: string
    }>
}

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const { userId } = await params;

        const session = await auth();

        if (!session?.userId || session.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        const result = await getUser(userId)


        return NextResponse.json({ user: result }, { status: 200, statusText: "success" });
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            statusText: "failed"
        });
    }
}
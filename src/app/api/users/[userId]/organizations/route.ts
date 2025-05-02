import { createOrganization } from "@/lib/actions/clerk/organizations";
import { getUserOrganizations } from "@/lib/actions/db/organizations";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: Promise<{
        userId: string
    }>
}

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const session = await auth();
        const { userId } = await params

        if (!session?.userId || session.userId !== userId) {
            return NextResponse.json({ error: "User is not authorized to fetch organizations" }, {
                status: 401,
                statusText: "unauthorized"
            });
        }

        const result = await getUserOrganizations(session.userId)

        return NextResponse.json({ organizations: result }, { status: 200, statusText: "success" });
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            statusText: "failed"
        });
    }
}



export async function POST(request: NextRequest, { params }: Params) {
    try {
        const data = await request.json();

        const session = await auth();
        const { userId } = await params

        if (!data?.name) {
            return NextResponse.json({ error: "Organization name is required" }, {
                status: 400,
                statusText: "failed"
            });
        }

        if (!session?.userId || session.userId !== userId) {
            return NextResponse.json({ error: "User is not authorized to create organization" }, {
                status: 401,
                statusText: "unauthorized"
            });
        }

        const result = await createOrganization(userId, data)
        await revalidatePath("/")
        return NextResponse.json({ user: result }, { status: 200, statusText: "success" });
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            statusText: "failed"
        });
    }
}
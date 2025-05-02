import { deleteOrganization } from "@/lib/actions/clerk/organizations";
import { deleteUserOrganization, getUserOrganization, updateUserOrganization } from "@/lib/actions/db/organizations";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type OrganizationParams = {
    params: Promise<{
        organizationId: string;
        userId: string
    }>
}

export async function GET(_request: NextRequest, { params }: OrganizationParams) {
    try {
        const { organizationId, userId } = await params;

        const session = await auth();

        if (!session?.userId || session.userId !== userId) {
            return NextResponse.json({ error: "User is not authorized to fetch organization" }, {
                status: 401,
            });
        }

        const result = await getUserOrganization(userId, organizationId)

        return NextResponse.json({ user: result }, { status: 200, statusText: "success" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            statusText: "failed"
        });
    }
}



export async function PUT(request: NextRequest, { params }: OrganizationParams) {
    try {
        const data = await request.json();
        const { organizationId, userId } = await params;

        if (!data?.name) {
            return NextResponse.json({ error: "Organization name is required" }, {
                status: 400,
                statusText: "failed"
            });
        }


        const session = await auth();

        if (!session?.userId || session.userId !== userId) {
            return NextResponse.json({ error: "User is not authorized to update organization" }, {
                status: 401,
                statusText: "unauthorized"
            });
        }

        const result = await updateUserOrganization(userId, organizationId, data)

        return NextResponse.json({ user: result }, { status: 200, statusText: "success" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            statusText: "failed"
        });
    }
}

export async function DELETE(_: NextRequest, { params }: OrganizationParams) {
    try {
        const { organizationId, userId } = await params;

        const session = await auth();

        if (!session?.userId || session.userId !== userId) {
            return NextResponse.json({ error: "User is not authorized to update organization" }, {
                status: 401,
                statusText: "unauthorized"
            });
        }

        const result = await deleteOrganization(session.userId, organizationId)

        await revalidatePath("/")

        return NextResponse.json({ user: result }, { status: 200, statusText: "success" });


    } catch (error) {
        return NextResponse.json({ error: "Something went wrong." }, {
            status: 500,
            statusText: "failed"
        });
    }
}
import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET || "";

    if (!SIGNING_SECRET) {
        console.error("Error: Missing signing secret");
        return NextResponse.json({ message: "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local" }, {
            status: 400,
        });
    }

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Error: Missing Svix headers");
        return NextResponse.json({ message: "Error: Missing Svix headers" }, {
            status: 400,
        });
    }

    // Get body
    const payloadString = await req.text();

    let evt: WebhookEvent;

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Verify payload with headers
    try {
        evt = wh.verify(payloadString, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error: Could not verify webhook:", err);
        return NextResponse.json({ message: "Error: Verification error" }, {
            status: 400,
        });
    }
    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    try {

        console.log("eventType", eventType);
        console.log("id", id);
        switch (eventType) {
            case "user.created": {
                if (id) {
                    const clerkUser = evt.data as UserJSON & { profile_image_url: string };
                    break;
                }
            }
            case "user.updated": {
                if (id) {
                    const clerkUser = evt.data as UserJSON & { profile_image_url: string };
                    break;
                }
            }
            case "user.deleted": {
                if (id) {
                    console.log(`Deleting user with ID ${id}`);
                    break;
                }
            }
            default:
                console.log(
                    `Received webhook with ID ${id} and event type of ${eventType}`,
                );
                console.log(
                    `Received Data: ${JSON.stringify(evt.data, null, 2)}`,
                );
                break;
        }
    } catch (err) {
        console.error("Error: Webhook action:", err);
        return NextResponse.json({ message: "Error: Something went wrong!" }, {
            status: 500,
        });
    }

    // console.log('Webhook payload:', payloadString)
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}

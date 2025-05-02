import { Webhook } from "svix";
import { headers } from "next/headers";
import { OrganizationMembershipJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createUser, deleteUserByClerkId, updateUser } from "@/lib/actions/db/users";
import { createUserOrganization, deleteUserOrganization, updateUserOrganization } from "@/lib/actions/db/organizations";
import { deleteUserOrganizations, updateUserPublicMetadata } from "@/lib/actions/clerk/users";
import { Role } from "@/db/schema";
import { createOrganization } from "@/lib/actions/clerk/organizations";

export async function POST(req: NextRequest) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET || "";

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
        switch (eventType) {
            case "user.created": {
                const clerkUser = evt.data;
                if (clerkUser) {
                    await createUser({
                        id: clerkUser.id,
                        email: clerkUser.email_addresses[0].email_address,
                        firstName: clerkUser?.first_name || "",
                        lastName: clerkUser?.last_name || "",
                        imageUrl: clerkUser?.image_url || "",
                    })
                    await createOrganization(clerkUser.id, {
                        name: clerkUser.email_addresses[0].email_address.split("@")[0],
                        slug: clerkUser.email_addresses[0].email_address.split("@")[0],
                    })
                }
                break;
            }
            case "user.updated": {
                const clerkUser = evt.data;
                if (clerkUser) {
                    await updateUser(clerkUser.id, {
                        email: clerkUser.email_addresses[0].email_address,
                        firstName: clerkUser?.first_name || "",
                        lastName: clerkUser?.last_name || "",
                        imageUrl: clerkUser?.image_url || "",
                    })
                }
                break;
            }
            case "user.deleted": {
                if (id) {
                    console.log(`Deleting user with ID ${id}`);
                    await deleteUserByClerkId(id)
                    await deleteUserOrganizations(id)
                }
                break;
            }
            case "organization.created": {
                const clerkOrg = evt.data;
                if (id && clerkOrg && clerkOrg.created_by) {
                    await createUserOrganization(clerkOrg.created_by, {
                        name: clerkOrg.name,
                        slug: clerkOrg.slug,
                        id: id,
                        membersCount: 1,
                        userId: clerkOrg.created_by,
                        imageUrl: clerkOrg?.image_url || ""
                    })
                }
                break;
            }
            case "organization.updated": {
                const clerkOrg = evt.data;
                if (id && clerkOrg && clerkOrg.created_by) {

                    await updateUserOrganization(clerkOrg.created_by, id, {
                        name: clerkOrg.name,
                        slug: clerkOrg.slug,
                        imageUrl: clerkOrg?.image_url || "",
                    })
                }
                break;
            }
            case "organization.deleted": {
                if (id) {
                    console.log(`Deleting organization with ID ${id}`);
                    await deleteUserOrganization(id)
                }
                break;
            }
            case "organizationMembership.created":
            case "organizationMembership.updated": {
                const clerkOrgMembership = evt.data as OrganizationMembershipJSON & { role_name: Role };
                await updateUserPublicMetadata(clerkOrgMembership.public_user_data.user_id, {
                    role: clerkOrgMembership.role,
                })
                await updateUser(clerkOrgMembership.public_user_data.user_id, {
                    role: clerkOrgMembership?.role_name,
                })
                await updateUserOrganization(
                    clerkOrgMembership.public_user_data.user_id,
                    clerkOrgMembership.organization.id, {
                    membersCount: clerkOrgMembership?.organization?.members_count || 0,
                })
            }
            default:
                console.log(
                    `Received webhook with ID ${id} and event type of ${eventType} Data: ${JSON.stringify(evt.data, null, 2)}`,
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

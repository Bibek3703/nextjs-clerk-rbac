"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Trash } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { DialogProvider } from "@/contexts/dialog-context"
import { Button } from "../ui/button"
import { DialogOrganization } from "./organizations/org-dialog"
import { useCurrentOrganization, useDeleteOrganization, useOrganizations } from "@/hooks/use-organizations"
import { Skeleton } from "../ui/skeleton"
import { Organization } from "@/db/schema"
import { useAuth } from "@clerk/nextjs"



export function OrganizationSwitcher() {
    const { isMobile } = useSidebar()
    const { userId } = useAuth()
    const { data, isLoading } = useOrganizations(userId)
    const setOrganization = useCurrentOrganization((state) => state.setOrganization)
    const organization = useCurrentOrganization((state) => state.organization)
    const { mutate: deleteOrganization } = useDeleteOrganization(userId)


    React.useEffect(() => {
        if (userId && data?.organizations.length > 0 && !organization) {
            console.log("cleared")
            setOrganization(data?.organizations[0])
        }
    }, [userId, data?.organizations, organization])

    const handleDeleteOrganization = async (id: string) => {
        if (!id && userId) return
        await deleteOrganization(id)
        console.log({ organization, id })
        if (organization && organization.id === id) {
            await useCurrentOrganization.getState().clearStore()
        }
    }

    if (!userId) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {isLoading ?
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    </SidebarMenuButton>
                    : <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    {organization?.imageUrl && <Image src={organization?.imageUrl ?? ""} className="size-4" alt="Logo" width={200} height={200} />}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {organization?.name ?? ""}
                                    </span>
                                    <span className="truncate text-xs">{organization?.slug || ""}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        {data?.organizations && data?.organizations.length > 0 && <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                organizations
                            </DropdownMenuLabel>
                            {data?.organizations && data?.organizations.map((organization: Organization, index: number) => (
                                <DropdownMenuItem
                                    key={organization.name}
                                    onClick={() => setOrganization(organization)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {organization?.imageUrl && <Image src={organization?.imageUrl ?? ""} className="size-4" alt="Logo" width={200} height={200} />}
                                    </div>
                                    {organization.name}
                                    <DropdownMenuShortcut>⌘{organization.membersCount}</DropdownMenuShortcut>


                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 p-2" asChild>
                                <DialogProvider>
                                    <DialogOrganization
                                        title="Organization"
                                        trigger={<Button variant="ghost" size="sm" className="w-full justify-start">
                                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                                <Plus className="size-4" />
                                            </div>
                                            <div className="font-medium text-muted-foreground">Add Organization</div>
                                        </Button>}
                                    />
                                </DialogProvider>
                            </DropdownMenuItem>
                        </DropdownMenuContent>}
                    </DropdownMenu>}
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

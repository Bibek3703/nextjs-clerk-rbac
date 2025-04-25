"use client"

import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react"

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
import { OrgType, useCurrentOrganization } from "@/hooks/use-organizations"
import { Skeleton } from "../ui/skeleton"



export function OrganizationSwitcher({
    teams,
}: {
    teams?: OrgType[]
}) {
    const { isMobile } = useSidebar()
    const setOrganization = useCurrentOrganization((state) => state.setOrganization)
    const getOrganization = useCurrentOrganization((state) => state.getOrganization)
    const organization = useCurrentOrganization((state) => state.organization)

    React.useEffect(() => {
        if (teams && teams.length && !getOrganization()) {
            setOrganization(teams[0])
        }
    }, [teams])


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {teams && teams?.length > 0 ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    {getOrganization()?.logo && <Image src={getOrganization()?.logo ?? ""} className="size-4" alt="Logo" width={200} height={200} />}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {getOrganization()?.name ?? ""}
                                    </span>
                                    <span className="truncate text-xs">{getOrganization()?.slug || ""}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Teams
                            </DropdownMenuLabel>
                            {teams.map((team, index) => (
                                <DropdownMenuItem
                                    key={team.name}
                                    onClick={() => setOrganization(team)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {team?.logo && <Image src={team?.logo ?? ""} className="size-4" alt="Logo" width={200} height={200} />}
                                    </div>
                                    {team.name}
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                    :
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
                }
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

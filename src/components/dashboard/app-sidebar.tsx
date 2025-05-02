"use client"

import * as React from "react"
import {
    AudioWaveform,
    Calendar1,
    Command,
    GalleryVerticalEnd,
    LayoutDashboard,
    Settings2,
    Users,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import { useUser } from "@/hooks/use-users"
import { OrganizationSwitcher } from "./organization-switcher"
import { useOrganizations } from "@/hooks/use-organizations"
import { useAuth } from "@clerk/nextjs"

// This is sample data.
const menus = {
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Members",
            url: "/members",
            icon: Users,
        },
        {
            title: "Todos",
            url: "/todos",
            icon: Calendar1,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/settings",
                },
                {
                    title: "Organizations",
                    url: "/settings/organizations",
                },
                // {
                //     title: "Billing",
                //     url: "#",
                // },
                // {
                //     title: "Limits",
                //     url: "#",
                // },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { userId } = useAuth()
    const { data } = useUser(userId)


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrganizationSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={menus.navMain} />
            </SidebarContent>
            <SidebarFooter>
                {data?.user && <NavUser user={data?.user} />}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

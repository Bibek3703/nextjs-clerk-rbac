"use client"

import * as React from "react"
import {
    AudioWaveform,
    Calendar1,
    Command,
    GalleryVerticalEnd,
    LayoutDashboard,
    Settings2,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import { useCurrentUser } from "@/hooks/use-users"

// This is sample data.
const data = {
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
                    title: "Teams",
                    url: "/settings/teams",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: user } = useCurrentUser()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={[]} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

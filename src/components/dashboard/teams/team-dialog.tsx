"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TeamForm from "./team-form"

type DialogTeamProps = {
    title: string,
    description?: string,
    trigger: React.ReactNode | string,
}

export function DialogTeam({ title, description, trigger }: DialogTeamProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] pb-0">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>
                        {description}
                    </DialogDescription>}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <TeamForm />
                </div>
            </DialogContent>
        </Dialog>
    )
}

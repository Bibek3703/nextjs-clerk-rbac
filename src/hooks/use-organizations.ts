"use client"

import { ClerkOrganization, createOrganization } from "@/lib/actions/clerk/organizations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function addOrganization(organization: ClerkOrganization) {
    return createOrganization(organization)
}

export function useAddExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addOrganization,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            console.log({ data })
            if (data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ["teams"],
                });
            }
            toast.success("Team created successfully");
        },
        onError: (error: Error) => {
            console.log({ error })
            toast.error(error.message);
        },
    });
}
"use client"

import { Organization } from "@/db/schema";
import { createOrganization, deleteOrganization, updateOrganization } from "@/lib/actions/clerk/organizations";
import { getUserOrganizations } from "@/lib/actions/db/organizations";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function createTeam(organization: Organization) {
    return createOrganization(organization)
}

async function updateTeam({ organizationId, organization }: { organizationId: string, organization: Organization }) {
    return updateOrganization(organizationId, organization)
}

async function deleteTeam(organizationId: string) {
    return deleteOrganization(organizationId)
}

async function fetchTeams(userId?: string | null) {
    if (!userId) return
    return getUserOrganizations(userId)
}

export function useCreateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTeam,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["teams"] },);
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["teams"] });
            }
            toast.success("Team created successfully");
        },
        onError: (error: Error) => {
            console.log({ error })
            toast.error(error.message);
        },
    });
}

export function useUpdateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTeam,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["teams"], });
            }
            toast.success("Team update successfully");
        },
        onError: (error: Error) => {
            console.log({ error })
            toast.error(error.message);
        },
    });
}

export function useDeleteTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTeam,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["teams"] });
                toast.success("Team deleted successfully");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
            throw error;
        },
    });
}

export function useTeams(userId?: string | null) {

    return useQuery({
        queryKey: ["teams", userId],
        queryFn: () => fetchTeams(userId),
        enabled: !!userId,
    });
}
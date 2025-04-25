"use client"

import { Organization, organizations } from "@/db/schema";
import { createOrganization, deleteOrganization, updateOrganization } from "@/lib/actions/clerk/organizations";
import { getUserOrganizations } from "@/lib/actions/db/organizations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

async function addOrganization(organization: Organization) {
    return createOrganization(organization)
}

async function modifyOrganization({ organizationId, organization }: { organizationId: string, organization: Organization }) {
    return updateOrganization(organizationId, organization)
}

async function removeOrganization(organizationId: string) {
    return deleteOrganization(organizationId)
}

async function fetchTeams(userId?: string | null) {
    if (!userId) return
    return getUserOrganizations(userId)
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addOrganization,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] },);
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["organizations"] });
            }
            toast.success("Organization created successfully");
        },
        onError: (error: Error) => {
            console.log({ error })
            toast.error(error.message);
        },
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: modifyOrganization,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["organizations"], });
            }
            toast.success("Organization update successfully");
        },
        onError: (error: Error) => {
            console.log({ error })
            toast.error(error.message);
        },
    });
}

export function useDeleteOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeOrganization,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["organizations"] });
                toast.success("Organization deleted successfully");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
            throw error;
        },
    });
}

export function useOrganizations(userId?: string | null) {
    return useQuery({
        queryKey: ["organizations", userId],
        queryFn: () => fetchTeams(userId),
        enabled: !!userId,
    });
}

export type OrgType = {
    name: string
    logo: string | null
    slug: string
}

interface OrganizationState {
    organization?: OrgType | null;
    setOrganization: (org: OrgType) => void;
    getOrganization: () => OrgType;
    clearStore: () => void;
}

export const useCurrentOrganization = create<OrganizationState>()(
    persist(
        (set, get) => ({
            getOrganization: () => {
                // Get organization from localStorage
                const storageValue = localStorage.getItem('org-storage');
                if (storageValue) {
                    try {
                        const parsed = JSON.parse(storageValue);
                        return parsed.state?.organization || null;
                    } catch (e) {
                        console.error('Failed to parse organization from localStorage', e);
                        return null;
                    }
                }
                return get().organization;
            },
            setOrganization: (org: OrgType) => {
                set(() => ({
                    organization: org
                }));
            },
            clearStore: () => set(() => ({ organization: null })),
        }),
        {
            name: "org-storage", // unique name for the localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Store these properties in localStorage
                organization: state.organization,
            }),
            // Handle rehydration of non-serializable objects 
            onRehydrateStorage: () => (state) => {
                // Ensure audioPlayer is properly initialized after rehydration
                if (state) {
                    state.organization = null;
                }
            },
        }
    )
)
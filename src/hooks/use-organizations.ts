"use client"

import { Organization } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export async function fetchUserOrganizations(userId?: string | null) {
    if (!userId) return null
    const res = await fetch(`/api/users/${userId}/organizations`)
    const responseData = await res.json()
    return responseData
}


export function useOrganizations(userId?: string | null) {
    return useQuery({
        queryFn: async () => await fetchUserOrganizations(userId),
        queryKey: ["organizations"],
        enabled: !!userId
    });
}


async function fetchUserOrganization(organizationId: string, userId?: string | null,) {
    if (!userId) return null
    const res = await fetch(`/api/users/${userId}/organizations/${organizationId}`)
    const responseData = await res.json()
    if (res.ok) {
        return responseData
    }
    throw new Error(responseData?.error || "Something went wrong")
}


export function useOrganization(organizationId: string, userId?: string | null) {
    return useQuery({
        queryKey: ["organizations"],
        queryFn: async () => await fetchUserOrganization(organizationId, userId,),
    });
}

async function createOrganization(data: Organization, userId?: string | null) {
    try {
        if (!userId) return null
        const res = await fetch(`/api/users/${userId}/organizations`, {
            method: "POST",
            body: JSON.stringify(data)
        })
        const responseData = await res.json()
        if (res.ok) {
            return responseData
        }
        throw new Error(responseData?.error || "Something went wrong")
    } catch (error) {
        throw error
    }
}

export function useCreateOrganization(userId?: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Organization) => await createOrganization(data, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            if (data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ["organizations"]
                });
                toast.success("Organization created successfully");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

async function updateOrganization(
    organizationId: string,
    data: Organization,
    userId?: string | null,
) {
    try {
        if (!userId) return null
        const res = await fetch(`/api/users/${userId}/organizations/${organizationId}`, {
            method: "PUT",
            body: JSON.stringify(data)
        })
        const responseData = await res.json()
        if (res.ok) {
            return responseData
        }
        throw new Error(responseData?.error || "Something went wrong")
    } catch (error) {
        throw error
    }
}

export function useUpdateOrganization(userId?: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Organization) => await updateOrganization(data.id, data, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["organizations"]
            });
            if (data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ["organizations"]
                });
                toast.success("Organization update successfully");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

async function deleteOrganization(organizationId: string, userId?: string | null,) {
    if (!userId) return null
    const res = await fetch(`/api/users/${userId}/organizations/${organizationId}`, {
        method: "DELETE"
    })
    const responseData = await res.json()
    if (res.ok) {
        return responseData
    }
    throw new Error(responseData?.error || "Something went wrong")
}

export function useDeleteOrganization(userId?: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (organizationId: string) => await deleteOrganization(organizationId, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["organizations"],
            });
            if (data) {
                queryClient.invalidateQueries({
                    queryKey: ["organizations"],
                });
                toast.success("Organization deleted successfully");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}





interface OrganizationState {
    organization?: Organization | null;
    setOrganization: (org: Organization) => void;
    // getOrganization: () => OrgType;
    clearStore: () => void;
}

export const useCurrentOrganization = create<OrganizationState>()(
    persist(
        (set) => ({
            organization: null,
            setOrganization: (org: Organization) => {
                set(() => ({
                    organization: org
                }));
            },
            clearStore: () => set(() => ({ organization: null })),
        }),
        {
            name: "org-storage", // unique name for the localStorage key
        }
    )
)
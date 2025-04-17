"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAddExperience } from '../use-organizations';

const formSchema = z.object({
    name: z.string().min(1, { message: "Team name is required" }),
});

function useTeamForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { mutate: addOrganization, isPending } = useAddExperience();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await addOrganization(values)
    }

    return {
        form,
        onSubmit,
        isPending
    }
}

export default useTeamForm

"use client"

import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React from 'react';
import { toast } from 'sonner';
import { useSignIn } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    emailAddress: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password is required" }),
});

function useSignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: "",
            password: ""
        },
    });


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!isLoaded) return
        setLoading(true)
        try {
            const signInAttempt = await signIn.create({
                identifier: values.emailAddress,
                password: values.password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.push('/dashboard')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }

        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            // console.error(JSON.stringify(err, null, 2))
            toast.error(JSON.stringify(err?.message || "Something went wrong", null, 2))
        } finally {
            setLoading(false)
        }
    }

    return {
        form,
        onSubmit,
        loading,
    }
}

export default useSignInForm

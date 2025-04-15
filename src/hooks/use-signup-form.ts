"use client"

import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignUp } from '@clerk/clerk-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    emailAddress: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password is required" }),
});

function useSignUpForm() {
    const { isLoaded, signUp } = useSignUp()
    const [verifying, setVerifying] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            emailAddress: "",
            password: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!isLoaded) return
        setLoading(true)
        try {
            await signUp.create({ ...values })

            // Send the user an email with the verification code
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            })

            // Set 'verifying' true to display second form
            // and capture the OTP code
            setVerifying(true)
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
        verifying,
        loading
    }
}

export default useSignUpForm

"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'
import useSignUpForm from '@/hooks/forms/use-signup-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import SocialLoginButtons from './social-login-buttons'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import VerificationForm from './verification-form'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

function SignUpForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { form, verifying, loading, onSubmit } = useSignUpForm()

    // Display the verification form to capture the OTP code
    if (verifying) {
        return (
            <VerificationForm redirectUrl='/dashboard' />
        )
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>
                        Register with your Apple or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <SocialLoginButtons />
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid gap-6">
                                    <div className='grid gap-2 grid-cols-2'>
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="firstName"
                                                            placeholder="Firstname"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>)
                                            }
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="lastName"
                                                            placeholder="Lastname"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>)
                                            }
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="emailAddress"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel htmlFor="emailAddress">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="emailAddress"
                                                        type="email"
                                                        autoComplete="email"
                                                        placeholder="user@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>)
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <div className="flex items-center">
                                                    <FormLabel htmlFor="password">Password</FormLabel>
                                                    {/* <Link
                                                        href="#"
                                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </Link> */}
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>)
                                        }
                                    />

                                    <Button type="submit" className="w-full">
                                        {loading && <Loader2 className='animate-spin w-3 h-3' />}
                                        <span>Sign Up</span>
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Already registered?{" "}
                            <a href="/sign-in" className="underline underline-offset-4">
                                Sign in
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUpForm

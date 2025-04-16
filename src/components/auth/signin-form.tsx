"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'
import useSignInForm from '@/hooks/use-signin-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import SocialLoginButtons from './social-login-buttons'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

function SignInForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { form, loading, onSubmit } = useSignInForm()


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>
                        Login with your Apple or Google account
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
                                                    <Link
                                                        href="#"
                                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </Link>
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
                                        <span>Sign In</span>
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Not registered yet?{" "}
                            <a href="/sign-up" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

export default SignInForm

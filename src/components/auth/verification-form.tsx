"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import useVerificationForm from '@/hooks/use-verification-form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { Loader2 } from 'lucide-react'

function VerificationForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { form, loading, onSubmit } = useVerificationForm({ redirectUrl: "/onboarding" })
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Verification</CardTitle>
                    <CardDescription>
                        Enter your verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6 text-center">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <FormControl>
                                                <InputOTP id="code" maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription>
                                                Please enter code sent to your email.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    {loading && <Loader2 className='animate-spin w-3 h-3' />}
                                    <span>Verify Now</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerificationForm

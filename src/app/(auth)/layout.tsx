import Link from "next/link";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-sm space-y-4">
                <div className="flex flex-col gap-6">
                    {children}
                </div>
                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
                </div>
                <div id="clerk-captcha" className="w-full flex justify-center" />
            </div>
        </div>
    );
}

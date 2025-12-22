"use client";

import { Suspense } from"react";
import { useSearchParams } from"next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { AlertCircle } from"lucide-react";
import Link from"next/link";

function ErrorContent() {
	const searchParams = useSearchParams();
	const message = searchParams.get("message") ||"An unexpected error occurred";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
			<Card className="w-full max-w-md rounded-sm-sm shadow-xs">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm-full">
						<AlertCircle className="h-10 w-10 text-orange-600" />
					</div>
					<CardTitle className="text-2xl">Payment Processing</CardTitle>
					<CardDescription>
						We're verifying your payment
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="bg-muted p-4">
						<p className="text-sm text-muted-foreground">Error:</p>
						<p className="text-sm font-medium mt-1">{message}</p>
					</div>

					<div className="space-y-2 text-sm text-muted-foreground">
						<p className="font-medium text-foreground">What can you do?</p>
						<p>• If payment was deducted, don't worry - it's being processed</p>
						<p>• Check your email for payment confirmation</p>
						<p>• Contact support with your transaction details</p>
						<p>• Our team will manually verify and activate your account</p>
					</div>

					<div className="pt-4 space-y-2">
						<Button asChild className="w-full rounded-sm h-10">
							<Link href="/login">Go to Login</Link>
						</Button>
						<Button asChild variant="outline" className="w-full rounded-sm h-10">
							<Link href="/">Go to Home</Link>
						</Button>
					</div>

					<div className="text-center text-sm text-muted-foreground">
						<p>Need help? Contact support with your payment details</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function EnrollmentErrorPageWrapper() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-sm-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		}>
			<ErrorContent />
		</Suspense>
	);
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminHeader } from "@/components/admin-header";
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Wait for auth to load
		if (isLoading) return;

		// Redirect to login if not authenticated
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		// Redirect students to student dashboard
		if (user && user.role !== "admin") {
			router.push("/students/dashboard");
			return;
		}
	}, [isAuthenticated, isLoading, user, router]);

	// Show loading state while checking auth
	if (isLoading || !user || user.role !== "admin") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<AdminHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}

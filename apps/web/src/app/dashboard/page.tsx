import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { headers } from "next/headers";
import { auth } from "@vault/auth";
import { authClient } from "@/lib/auth-client";
import Header from "@/components/header";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div>
			<Header />

			<Dashboard session={session} />
		</div>
	);
}

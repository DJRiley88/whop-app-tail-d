import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import ExperienceClient from "./experience-client";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// Get headers and experienceId
	const headersList = await headers();
	const { experienceId } = await params;

	// Verify user token from Whop headers
	const { userId } = await whopSdk.verifyUserToken(headersList);

	// Check if user has access to this experience
	const result = await whopSdk.access.checkIfUserHasAccessToExperience({
		userId,
		experienceId,
	});

	const hasAccess = result.hasAccess;
	const accessLevel = result.accessLevel;

	// Show appropriate message based on access level
	if (!hasAccess || accessLevel === "no_access") {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center" style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#0A0A0A'
			}}>
				<div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-800 max-w-md">
					<h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
					<p className="text-gray-400 mb-6">
						You do not have access to this experience.
					</p>
					<p className="text-sm text-gray-500">
						Please ensure you have the required membership or subscription to access this content.
					</p>
				</div>
			</div>
		);
	}

	// If user has access, render the experience page
	return <ExperienceClient experienceId={experienceId} accessLevel={accessLevel} />;
}

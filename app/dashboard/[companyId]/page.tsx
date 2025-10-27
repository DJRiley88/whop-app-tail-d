import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The companyId is a path param
	const { companyId } = await params;

	// The user token is in the headers
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const result = await whopSdk.access.checkIfUserHasAccessToCompany({
		userId,
		companyId,
	});

	const user = await whopSdk.users.getUser({ userId });
	const company = await whopSdk.companies.getCompany({ companyId });

	// Either: 'admin' | 'no_access';
	// 'admin' means the user is an admin of the company, such as an owner or moderator
	// 'no_access' means the user is not an authorized member of the company
	const { accessLevel } = result;

	// Show access denied message if user doesn't have access
	if (!result.hasAccess || accessLevel === "no_access") {
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
						You are not an authorized member of this company.
					</p>
					<p className="text-sm text-gray-500">
						Please contact the company administrator to gain access.
					</p>
				</div>
			</div>
		);
	}

	// Show admin message if user has access
	return (
		<div className="min-h-screen bg-black flex items-center justify-center" style={{
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#0A0A0A'
		}}>
			<div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-800 max-w-2xl">
				<h1 className="text-2xl font-bold text-white mb-4">
					Hi <strong>{user.name}</strong>!
				</h1>
				<p className="text-gray-400 mb-4">
					You are an <strong className="text-blue-400">{accessLevel}</strong> of the company: <strong>{company.title}</strong>
				</p>
				<div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 text-left">
					<p className="text-sm text-gray-400 mb-2">Your Details:</p>
					<p className="text-sm text-white mb-1">
						User ID: <code className="text-blue-400">{userId}</code>
					</p>
					<p className="text-sm text-white">
						Username: <strong className="text-blue-400">@{user.username}</strong>
					</p>
				</div>
			</div>
		</div>
	);
}

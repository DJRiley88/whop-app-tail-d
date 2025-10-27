"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Users, Clock } from "lucide-react";

export default function Page() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to dashboard immediately
		router.push("/dashboard");
	}, [router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
			<div className="text-center">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
					<Trophy className="h-10 w-10 text-white" />
				</div>
				<h1 className="text-5xl font-bold text-gray-900 mb-4">
					Welcome to <span className="text-blue-600">Tailed</span>
				</h1>
				<p className="text-xl text-gray-600 mb-6">
					Redirecting to dashboard...
				</p>
			</div>
		</div>
	);
}

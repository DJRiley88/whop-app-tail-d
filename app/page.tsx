"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Users, Clock } from "lucide-react";

export default function Page() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to dashboard after a short delay to show the landing page
		const timer = setTimeout(() => {
			router.push("/dashboard");
		}, 3000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
						<Trophy className="h-10 w-10 text-white" />
					</div>
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						Welcome to <span className="text-blue-600">Tailed</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						The ultimate gamified "tail-the-slip" app for sports-betting creators and their communities. 
						Earn points, compete on leaderboards, and win prizes!
					</p>
					<div className="flex justify-center gap-4">
						<Button size="lg" onClick={() => router.push("/dashboard")}>
							Get Started
						</Button>
						<Button variant="outline" size="lg" onClick={() => router.push("/experiences")}>
							View Challenges
						</Button>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					<Card className="text-center">
						<CardHeader>
							<Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
							<CardTitle>Tail for Points</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Click betting slip links within the time window to earn points and compete for prizes.
							</CardDescription>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
							<CardTitle>Win Prizes</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Compete on leaderboards and win your share of the prize pool based on your performance.
							</CardDescription>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
							<CardTitle>Community</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Join challenges with other fans and see who can tail the most slips for points.
							</CardDescription>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
							<CardTitle>Time Windows</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Each bet has a limited time window - tail quickly to earn points before time runs out!
							</CardDescription>
						</CardContent>
					</Card>
				</div>

				{/* How It Works */}
				<div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-blue-600">1</span>
							</div>
							<h3 className="text-xl font-semibold mb-3">Join a Challenge</h3>
							<p className="text-gray-600">
								Browse active challenges and join the ones that interest you. Each challenge has its own prize pool and rules.
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-green-600">2</span>
							</div>
							<h3 className="text-xl font-semibold mb-3">Tail the Slips</h3>
							<p className="text-gray-600">
								When new bets are posted, click the links within the time window to earn points. The faster you tail, the more points you get!
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-yellow-600">3</span>
							</div>
							<h3 className="text-xl font-semibold mb-3">Win Prizes</h3>
							<p className="text-gray-600">
								Compete on the leaderboard and win your share of the prize pool based on your total points earned.
							</p>
						</div>
					</div>
				</div>

				{/* Redirect Notice */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full">
						<Clock className="h-4 w-4" />
						<span>Redirecting to dashboard in 3 seconds...</span>
					</div>
				</div>
			</div>
		</div>
	);
}

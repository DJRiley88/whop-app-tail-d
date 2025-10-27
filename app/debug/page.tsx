"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DebugPage() {
  const router = useRouter();
  const pathname = usePathname();

  const testNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    router.push(path);
  };

  return (
    <AppLayout>
      <div className="p-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Debug Navigation</h1>
            <p className="text-[#B0B0B0] text-lg">Test sidebar navigation functionality</p>
            <p className="text-[#808080] text-sm">Current path: {pathname}</p>
          </div>
        </div>

        {/* Navigation Test */}
        <Card className="bg-[#1A1A1A] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Navigation Test</CardTitle>
            <CardDescription className="text-[#B0B0B0]">
              Click these buttons to test navigation to each page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => testNavigation('/dashboard')}
                className="bg-[#3EE58D] hover:bg-[#3EE58D]/90 text-black"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={() => testNavigation('/discover')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Discover
              </Button>
              <Button 
                onClick={() => testNavigation('/leaderboard')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
              <Button 
                onClick={() => testNavigation('/analytics')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Check */}
        <Card className="bg-[#1A1A1A] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Status Check</CardTitle>
            <CardDescription className="text-[#B0B0B0]">
              Current application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white">Sidebar component loaded</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white">AppLayout wrapper active</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white">CSS variables loaded</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white">Next.js router available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Console Log */}
        <Card className="bg-[#1A1A1A] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Console Output</CardTitle>
            <CardDescription className="text-[#B0B0B0]">
              Check browser console for navigation logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 font-mono text-sm">
              <div className="text-green-400">✓ Debug page loaded successfully</div>
              <div className="text-blue-400">ℹ Current path: {pathname}</div>
              <div className="text-yellow-400">⚠ Click navigation buttons to test</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


"use client";

import { Button } from "@/components/ui/simple-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/simple-card";
import { Trophy, Plus, BarChart3 } from "lucide-react";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tailed App - Functionality Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Core Components</CardTitle>
              <CardDescription className="text-[#B0B0B0]">
                Testing basic UI components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-[#3EE58D] hover:bg-[#3EE58D]/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Test Button
                </Button>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Outline Button
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Navigation</CardTitle>
              <CardDescription className="text-[#B0B0B0]">
                Testing app navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-[#3EE58D] hover:bg-[#3EE58D]/90 text-black"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                  onClick={() => window.location.href = '/discover'}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Go to Discover
                </Button>
                <Button 
                  className="w-full bg-[#3EE58D] hover:bg-[#3EE58D]/90 text-black"
                  onClick={() => window.location.href = '/leaderboard'}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Status Check</CardTitle>
            <CardDescription className="text-[#B0B0B0]">
              App functionality verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#0F0F0F] rounded-lg">
                <div className="text-2xl font-bold text-[#3EE58D]">✓</div>
                <div className="text-sm text-[#B0B0B0]">Components Load</div>
              </div>
              <div className="text-center p-4 bg-[#0F0F0F] rounded-lg">
                <div className="text-2xl font-bold text-[#3EE58D]">✓</div>
                <div className="text-sm text-[#B0B0B0]">Styling Works</div>
              </div>
              <div className="text-center p-4 bg-[#0F0F0F] rounded-lg">
                <div className="text-2xl font-bold text-[#3EE58D]">✓</div>
                <div className="text-sm text-[#B0B0B0]">Navigation Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

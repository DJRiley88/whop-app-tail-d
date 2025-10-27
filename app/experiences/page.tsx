"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy, Clock, DollarSign, Users, Target } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  totalPrizePool: string;
  totalBets: number;
  totalTails: number;
  uniqueTailers: number;
}

export default function ExperiencesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges?type=active");
      const data = await response.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-300">Loading challenges...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ paddingLeft: '120px', paddingRight: '120px', paddingTop: '40px' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Active Challenges</h1>
          <p className="text-[#B0B0B0]">Join a challenge and start competing</p>
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <div className="rounded-xl p-24 text-center border" style={{ 
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255,255,255,0.1)',
          }}>
            <Trophy className="h-24 w-24 mx-auto mb-8" style={{ color: '#00D9FF' }} />
            <h3 className="text-4xl font-bold mb-6" style={{ color: '#00D9FF', fontWeight: '700' }}>
              No Active Challenges
            </h3>
            <p className="mb-12 text-xl" style={{ color: '#B0B0B0' }}>
              There are no active challenges at the moment. Check back later!
            </p>
            <Link href="/dashboard">
              <button 
                className="px-10 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #00D9FF 0%, #14B8A6 100%)',
                  color: 'white',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
                }}
              >
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challenges.map((challenge) => (
              <Link 
                key={challenge.id}
                href={`/experiences/${challenge.id}`}
              >
                <div 
                  className="group relative overflow-hidden rounded-xl border shadow-lg transition-all duration-200 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  style={{ 
                    backgroundColor: '#1A1A1A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    padding: '24px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 217, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="mb-4">
                    <span 
                      className="px-4 py-2 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontWeight: '700' }}>
                    {challenge.title}
                  </h3>
                  <p className="text-base mb-8" style={{ color: '#B0B0B0' }}>
                    {challenge.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#1E1E1E' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5" style={{ color: '#00D9FF' }} />
                        <div className="text-sm" style={{ color: '#808080' }}>Prize Pool</div>
                      </div>
                      <div className="text-xl font-bold text-white">
                        ${parseFloat(challenge.totalPrizePool).toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#1E1E1E' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5" style={{ color: '#00D9FF' }} />
                        <div className="text-sm" style={{ color: '#808080' }}>Total Bets</div>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {challenge.totalBets || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#808080' }}>
                      <Users className="h-4 w-4" />
                      <span>{challenge.uniqueTailers || 0} participants</span>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#00D9FF' }}>
                      View Challenge →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}


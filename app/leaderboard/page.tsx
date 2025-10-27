"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/simple-card";
import { Button } from "@/components/ui/simple-button";
import { 
  Trophy, 
  Users, 
  Clock, 
  Search, 
  Medal,
  Crown,
  Award,
  ChevronDown,
  Filter,
  TrendingUp,
  Activity,
  Star,
  Target,
  Zap
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "ended" | "archived";
  startDate: string;
  endDate: string;
  totalPrizePool: string;
  totalBets: number;
  totalTails: number;
  uniqueTailers: number;
}

interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  rank: number;
  lastTailAt: string;
}

interface UserTailStats {
  userId: string;
  totalPoints: number;
  totalTails: number;
  validTails: number;
  rank?: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenges data
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        
        // Fetch challenges
        const challengesResponse = await fetch('/api/challenges?type=active');
        const challengesData = await challengesResponse.json();
        
        if (challengesResponse.ok) {
          const challengesList = challengesData.challenges || [];
          setChallenges(challengesList);
        } else {
          setError('Failed to fetch challenges');
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setError('Failed to load challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || challenge.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#10B981] text-white';
      case 'ended':
        return 'bg-[#F59E0B] text-white';
      case 'draft':
        return 'bg-[#3B82F6] text-white';
      default:
        return 'bg-[#808080] text-white';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const handleChallengeClick = (challengeId: string) => {
    // Navigate to individual challenge leaderboard
    router.push(`/leaderboard/${challengeId}`);
  };

  return (
    <AppLayout>
      <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.2' }}>Challenge Leaderboards</h1>
            <p className="text-[#B0B0B0] text-sm" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>Click on a challenge to view its leaderboard and rankings</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute z-10" style={{ left: '24px', top: '50%', transform: 'translateY(-50%)' }}>
                <Search className="h-4 w-4 text-[#808080]" />
              </div>
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-16 pr-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-[#606060] focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]/30 transition-all duration-200"
                style={{ height: '40px', fontSize: '14px', paddingLeft: '64px' }}
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-[#00D9FF]/30 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all duration-200"
                style={{ padding: '10px 20px', fontWeight: '500' }}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-white/10">
                <div className="w-8 h-8 bg-[#00D9FF] rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black">U</span>
                </div>
                <span className="text-white font-medium text-sm hidden sm:inline">Uxisrat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8 space-y-8 w-full mt-16">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF] mx-auto mb-4"></div>
            <p className="text-[#808080]">Loading challenges...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>
              Error loading data
            </h3>
            <p className="text-[#808080]" style={{ fontSize: '14px', fontWeight: '400' }}>
              {error}
            </p>
          </div>
        )}

        {/* Challenge Overview Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full" style={{ marginTop: '32px' }}>
            {filteredChallenges.map((challenge) => {
              return (
                <div 
                  key={challenge.id}
                  className="group relative overflow-hidden rounded-xl border shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  style={{ 
                    backgroundColor: '#1A1A1A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    padding: '24px'
                  }}
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  {/* Header with Status and Date */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide ${getStatusColor(challenge.status)}`} style={{ padding: '4px 8px', fontSize: '10px' }}>
                      {challenge.status.toUpperCase()}
                    </div>
                    <div className="text-sm text-[#808080]" style={{ fontSize: '14px', fontWeight: '400' }}>
                      {formatDateRange(challenge.startDate, challenge.endDate)}
                    </div>
                  </div>

                  {/* Challenge Title */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00D9FF] transition-colors" style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.4' }}>
                      {challenge.title}
                    </h3>
                    <p className="text-[#B0B0B0] text-sm leading-relaxed" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.6' }}>
                      {challenge.description}
                    </p>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                        {challenge.uniqueTailers.toLocaleString()}
                      </div>
                      <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                        PARTICIPANTS
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                        {challenge.totalTails.toLocaleString()}
                      </div>
                      <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                        TAILS
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                        ${parseFloat(challenge.totalPrizePool).toLocaleString()}
                      </div>
                      <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                        PRIZE POOL
                      </div>
                    </div>
                  </div>

                  {/* Click to View Leaderboard */}
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[#00D9FF] text-sm font-medium group-hover:text-[#00D9FF]/80 transition-colors">
                      <Trophy className="h-4 w-4" />
                      <span>View Leaderboard</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>
              No challenges found
            </h3>
            <p className="text-[#808080]" style={{ fontSize: '14px', fontWeight: '400' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      </div>
    </AppLayout>
  );
}